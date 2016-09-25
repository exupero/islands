(ns isle.core
  (:require-macros [isle.macros :refer [spy]])
  (:require [clojure.string :as string]
            [vdom.core :refer [renderer]]
            [isle.math :as m]
            [isle.svg :as s]
            [isle.vector :as v]))

(enable-console-print!)

(defn point-type [_ p]
  (get-in p [:source :type]))

(defn point-depth [pts p]
  (condp = (get-in p [:source :type])
    :radial 1
    :midpoint (inc (max (point-depth pts (pts (get-in p [:source :left])))
                        (point-depth pts (pts (get-in p [:source :right])))))
    :river-mouth (get-in p [:source :depth])
    :river-segment (inc (point-depth pts (get-in p [:source :downstream])))))

(defn filter-to-depth [max-depth pts]
  (let [index (zipmap (map :id pts) pts)]
    (filter #(<= (point-depth index %) max-depth) pts)))

(defn ui [emit {:keys [island rivers depth] :as model}]
  (let [size 500]
    [:div {}
     [:div {}
      [:div {}
       [:button {:onclick #(emit :reset-points)} "Reset"]]
      [:div {}
       "Depth"
       [:input {:type :number :value depth :min 1 :max 20 :step 1
                :oninput #(emit :set-depth (-> % .-target .-value))}]
       [:input {:type :range :min 1 :max 20 :value depth
                :onchange #(emit :set-depth (-> % .-target .-value))}]]
      [:div {}
       [:svg {:width size :height size}
        [:rect {:class "water" :width size :height size}]
        [:g {:transform (s/translate (/ size 2) (/ size 2))}
         [:path {:class "island"
                 :d (as-> island x
                      (filter-to-depth depth x)
                      (map :position x)
                      (s/closed-path x))}]
         #_(for [river rivers]
           [:path {:class "river"
                   :d (as-> river x
                        (map :position x)
                        (s/path x))}])]]]]
     #_[:div {}
      [:div {}
       [:button {:onclick #(emit :reset-flood)} "Reset"]]
      [:svg {:width size :height size}
       [:g {:transform (s/translate (/ size 2) (/ size 2))}
        (let [cell 7]
          (for [[[x y]] (model :flood)]
            [:rect {:x (* cell x) :y (* cell y)
                    :width cell :height cell
                    :fill :lime}]))]]]]))

(defn loopback [xs]
  (concat xs [(first xs)]))

(defn seed-point []
  {:offset (rand)
   :balance (rand)
   :max-offset (+ 0.05 (rand))})

(defn circle [n radius]
  (for [theta (range 0 m/tau (/ m/tau n))
        :let [{:keys [offset balance] :as seed} (seed-point)]]
    (merge seed
           {:id (gensym "radial")
            :position (let [r (* radius (+ 1 (- offset balance)))]
                        [(* r (m/cos theta))
                         (* r (m/sin theta))])
            :source {:type :radial
                     :center [0 0]
                     :angle theta
                     :radius radius}})))

(defn river-mouth [mouth depth]
  (merge (seed-point)
         {:id (gensym "river-mouth")
          :position (:position (nth mouth 1))
          :max-offset (+ 0.05 (* 0.5 (rand)))
          :direction (let [[a b c] (map (comp v/vector :position) mouth)]
                       (v/+ (v/- b a) (v/- b c)))
          :source {:type :river-mouth
                   :outlet (nth mouth 1)
                   :mouth mouth
                   :depth depth}}))

(defn river-source [downstream]
  (merge (seed-point)
         {:id (gensym "river-segment")
          :max-offset (+ 0.05 (* 0.5 (rand)))
          :position (v/elements
                      (v/+ (v/vector (:position downstream))
                           (:direction downstream)))
          :source {:type :river-segment
                   :downstream downstream}}))

(defn midpoint [a b]
  (let [offset (rand)
        max-offset (m/avg (map :max-offset [a b]))
        balance (m/avg (map :balance [a b]))]
    {:id (gensym "midpoint")
     :offset offset
     :balance balance
     :max-offset max-offset
     :position (let [[x y :as a] (:position a)
                     [x' y' :as b] (:position b)
                     len (m/dist a b)
                     vlen (* max-offset len (- offset balance))
                     [mx my] [(m/avg [x x']) (m/avg [y y'])]
                     [dx dy] (m/unit-vector [(- (- y y')) (- x x')])]
                 [(+ mx (* vlen dx))
                  (+ my (* vlen dy))])
     :source {:type :midpoint
              :left (:id a)
              :right (:id b)}}))

(defn meander
  ([[left right] max-depth] (meander [left right] max-depth 0))
  ([[left right] max-depth depth]
   (if (and (<= depth max-depth)
            (<= 2 (m/dist (:position left) (:position right))))
     (let [mid (midpoint left right)]
       (concat (meander [left mid] (inc depth))
               (meander [mid right] (inc depth))))
     [left])))

(defn island [max-depth]
  (as-> (rand-int 17) x
    (+ 3 x)
    (circle x 100)
    (loopback x)
    (partition 2 1 x)
    (mapcat #(meander % max-depth) x)))

(defn outlets [pts]
  (let [outlet? (fn [[a b c]]
                  (let [[a b c] (map :position [a b c])]
                    (and (< (m/angle a b c) (/ m/tau 4))
                         #_(m/clockwise? a b c))))]
    (sequence
      (comp
        (mapcat
          (fn [d]
            (as-> pts x
                  (filter-to-depth d x)
                  (partition 3 1 x)
                  (filter outlet? x)
                  (map #(river-mouth % d) x)))))
      (range 1 13))))

(defn rivers [pts]
  (->> (outlets pts)
    (group-by #(get-in % [:source :outlet :id]))
    (filter (comp #(< 1 %) count val))
    (map (comp #(meander [% (river-source %)] 3) first val))))

(defn flood-spread [flooded [pos energy]]
  (let [open (->> [[-1 0] [1 0] [0 -1] [0 1]]
               (map #(mapv + pos %))
               (remove flooded))
        splits (as-> (count open) x
                 (repeatedly (dec x) rand)
                 (concat [0 1] x)
                 (sort x)
                 (partition 2 1 x)
                 (map (fn [[a b]] (* energy (- b a))) x))]
    (into {pos 0} (map vector open splits))))

(defn flood [seed]
  (loop [flooded seed]
    (let [spread (sequence
                   (comp
                     (filter #(< 1 (val %)))
                     (map #(flood-spread flooded %)))
                   flooded)]
      (if (seq spread)
        (recur (merge flooded (apply merge-with max spread)))
        flooded))))

(defonce model
  (atom {:depth 20}))

(defmulti emit (fn [t & _] t))

(defmethod emit :reset-points [_]
  (swap! model
    (fn [m]
      (let [pts (island 20)]
        (assoc m :island pts #_:rivers #_(rivers pts))))))

(defmethod emit :set-depth [_ v]
  (swap! model update :depth #(if (< 0 % 21) v %)))

(defmethod emit :reset-flood [_]
  (swap! model assoc :flood (flood {[0 0] (+ 1000 (rand-int 10000))})))

(defonce render!
  (let [r (renderer (.getElementById js/document "app"))]
    #(r (ui emit @model))))

(defonce on-update
  (add-watch model :rerender
    (fn [_ _ _ model]
      (render! model))))

(render! @model)
