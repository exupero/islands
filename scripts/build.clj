(require 'cljs.build.api)

(cljs.build.api/build "src"
  {:main 'isle.core
   :source-paths ["src"]
   :asset-path "js"
   :optimizations :advanced
   :output-to "resources/public/js/main.js"
   :output-dir "resources/public/js"})
