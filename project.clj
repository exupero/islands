(defproject isle "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths ["src"]
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.122" :exclusions [org.apache.ant/ant]]
                 [org.clojure/core.match "0.3.0-alpha4"]
                 [org.clojure/core.async "0.2.374"]
                 [rand-cljc "0.1.0"]
                 [vdom "0.1.1-SNAPSHOT"]]
  :profiles {:dev {:dependencies [[figwheel-sidecar "0.5.0-2" :scope "provided"]]}})
