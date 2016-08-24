(ns isle.core
  (:require-macros [isle.macros :refer [spy]])
  (:require [clojure.string :as string]
            [vdom.core :refer [renderer]]))

(enable-console-print!)

(defn translate [x y]
  (str "translate(" x "," y ")"))

(defn rotate [d]
  (str "rotate(" d ")"))

(defn pair [[x y]]
  (str x "," y))

(defn path [pts]
  (->> pts
    (map pair)
    (interpose "L")
    (string/join "")
    (str "M")))

(defn closed-path [pts]
  (if (seq pts)
    (str (path pts) "Z")
    ""))

(def sin js/Math.sin)
(def cos js/Math.cos)
(def pi js/Math.PI)
(def tau (* 2 pi))
(def sqrt js/Math.sqrt)
(def sqr #(js/Math.pow % 2))

(defn dist [[x y] [x' y']]
  (sqrt (+ (sqr (- x x')) (sqr (- y y')))))

(defn avg [xs]
  (/ (reduce + xs) (count xs)))

(defn circle [n r]
  (for [theta (range 0 tau (/ tau n))]
    [(* r (cos theta))
     (* r (sin theta))]))

(defn ui [emit model]
  (let [size 500]
    [:div {}
     [:button {:onclick #(emit :reset)} "Reset"]
     [:button {:onclick #(emit :step)} "Step"]
     [:div {}
      [:svg {:width size :height size}
       [:rect {:width size :height size :fill :dodgerblue}]
       [:g {:transform (translate (/ size 2) (/ size 2))}
        [:path {:d (closed-path (model :points))
                :stroke :black
                :fill :lime
                :fill-rule :evenodd}]]]]]))

(defn insert [f]
  (fn [rf]
    (let [prev (volatile! nil)]
      (fn
        ([] (rf))
        ([result] (rf result))
        ([result input]
         (let [p @prev]
           (vreset! prev input)
           (if p
             (if-let [m (f p input)]
               (rf (rf result m) input)
               (rf result input))
             (rf result input))))))))

(defn unit-vector [[x y]]
  (let [len (dist [0 0] [x y])]
    [(/ x len) (/ y len)]))

(defn perturb-point [[x y :as p] v max-dist]
  (let [d (* 2 max-dist (- (rand) 0.5))
        [dx dy] (unit-vector v)]
    [(+ x (* d dx))
     (+ y (* d dy))]))

(defn perturbed-midpoint [[x y :as a] [x' y' :as b]]
  (when (not= a b)
    (let [len (dist a b)]
      (perturb-point
        [(/ (+ x x') 2) (/ (+ y y') 2)]
        [(- (- y y')) (- x x')]
        (/ len 2)))))

(defn perturb-points [pts]
  (let [[cx cy :as c] [(avg (map first pts)) (avg (map second pts))]]
    (map
      (fn [[x y :as p]]
        (perturb-point
          p
          [(- x cx) (- y cy)]
          (/ (dist p c) 2)))
      pts)))

(defonce model (atom {:points (perturb-points (circle 3 150))}))

(defmulti emit (fn [t & _] t))

(defmethod emit :reset [_]
  (swap! model assoc :points (perturb-points (circle 3 150))))

(defmethod emit :step [_]
  (swap! model update :points #(sequence (insert perturbed-midpoint) (concat % [(first %)]))))

(comment
  (emit :step)
  (sequence (insert midpoint) (@model :points))
  )

(defonce render!
  (let [r (renderer (.getElementById js/document "app"))]
    #(r (ui emit @model))))

(defonce on-update
  (add-watch model :rerender
    (fn [_ _ _ model]
      (render! model))))

(render! @model)
