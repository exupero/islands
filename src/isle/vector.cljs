(ns isle.vector
  (:refer-clojure :exclude [IVector Vector vector + -])
  (:require-macros [isle.macros :refer [spy]])
  (:require [isle.math :refer [acos sqrt sqr]]))

(defprotocol IVector
  (elements [v])
  (add [v1 v2])
  (dot [v1 v2])
  (length [v])
  (scale [v s]))

(declare vector)

(defrecord Vector [els]
  IVector
  (elements [_] els)
  (add [_ v]
    (vector (map clojure.core/+ els (elements v))))
  (dot [_ v]
    (reduce clojure.core/+ (map * els (elements v))))
  (length [_]
    (sqrt (reduce clojure.core/+ (map sqr els))))
  (scale [_ s]
    (vector (map #(* s %) els))))

(defn vector [els]
  (Vector. els))

(def + add)

(defn -
  ([v] (scale v -1))
  ([v1 v2]
   (+ v1 (- v2))))

(defn unit [v]
  (scale v (/ (length v))))

(defn angle [v1 v2]
  (acos (/ (dot v1 v2)
           (* (length v1) (length v2)))))

(defn determinant [v1 v2]
  ; TODO only works on 2D vectors
  (let [[x1 y1] (elements v1)
        [x2 y2] (elements v2)]
    (clojure.core/- (* x1 y2) (* y1 x2))))

(defn orientation [v1 v2]
  (let [d (determinant v1 v2)]
    (cond
      (pos? d) ::counter-clockwise
      (zero? d) ::colinear
      (neg? d) ::clockwise)))
