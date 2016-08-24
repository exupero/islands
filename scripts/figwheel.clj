(require '[figwheel-sidecar.repl :as r]
         '[figwheel-sidecar.repl-api :as ra])

(ra/start-figwheel!
  {:figwheel-options {:css-dirs ["resources/public/css"]
                      :server-port 3454
                      :nrepl-port 7893
                      :nrepl-middleware ["cider.nrepl/cider-middleware"
                                         "cemerick.piggieback/wrap-cljs-repl"]}
   :build-ids ["dev"]
   :all-builds
   [{:id "dev"
     :figwheel {:on-jsload "isle.core/figwheel-reload"}
     :source-paths ["src"]
     :compiler {:main 'isle.core
                :optimizations :none
                :asset-path "js-dev"
                :output-to "resources/public/js-dev/main.js"
                :output-dir "resources/public/js-dev"
                :verbose true}}]})

(ra/cljs-repl)
