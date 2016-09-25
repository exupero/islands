(ns isle.math
  (:require-macros [isle.macros :refer [spy]]))

(def sin js/Math.sin)
(def cos js/Math.cos)
(def acos js/Math.acos)
(def pi js/Math.PI)
(def tau (* 2 pi))
(def sqrt js/Math.sqrt)
(def sqr #(js/Math.pow % 2))

(defn dist [[x y] [x' y']]
  (sqrt (+ (sqr (- x x')) (sqr (- y y')))))

(defn avg [xs]
  (/ (reduce + xs) (count xs)))

(def magnitude (partial dist [0 0]))

(defn unit-vector [[x y]]
  (let [len (dist [0 0] [x y])]
    [(/ x len) (/ y len)]))

(defn dot [[ax ay] [bx by]]
  (+ (* ax bx) (* ay by)))

(defn angle [[ax ay] [bx by] [cx cy]]
  (let [ba [(- bx ax) (- by ay)]
        bc [(- bx cx) (- by cy)]]
    (acos (/ (dot ba bc)
             (* (magnitude ba) (magnitude bc))))))

(defn slope [[ax ay] [bx by]]
  (/ (- by ay) (- bx ax)))

(defn determinant [[ax ay] [bx by]]
  (- (* ax by) (* ay bx)))

(defn diff [[ax ay] [bx by]]
  [(- ax bx) (- ay by)])

(defn scale [v s]
  (mapv #(* 2 %) v))

(defn clockwise? [a b c]
  (pos? (determinant (diff b a) (diff b c))))

(defn colinear? [a b c]
  (zero? (determinant (diff b a) (diff b c))))

(defn counter-clockwise? [a b c]
  (neg? (determinant (diff b a) (diff b c))))
