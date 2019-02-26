(ns pprint.core
    (:require [clojure.pprint :as pp]
              [clojure.edn :as edn]))

(defn ^:export read-edn [s]
  (let [data (edn/read-string s)]
    (clj->js data)))

(defn ^:export write-edn [js-obj]
  (let [data (js->clj js-obj :keywordize-keys true)]
    (with-out-str (pp/pprint data))))
