(ns pprint.core
    (:require [clojure.pprint :as pp]
              [clojure.edn :as edn]))

(defn ^:export pprint [s] 
    (with-out-str (pp/pprint (edn/read-string s))))
