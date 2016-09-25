(ns isle.svg
  (:require-macros [isle.macros :refer [spy]]))

(defn translate [x y]
  (str "translate(" x "," y ")"))

(defn rotate [d]
  (str "rotate(" d ")"))

(defn pair [[x y]]
  (str x "," y))

(defn path [pts]
  (as-> pts x
    (map pair x)
    (interpose "L" x)
    (clj->js x)
    (.join x "")
    (str "M" x)))

(defn closed-path [pts]
  (if (seq pts)
    (str (path pts) "Z")
    ""))
