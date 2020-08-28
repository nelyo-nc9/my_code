import bsScroll from './components/scroll/scroll.vue'
// import 'font-awesome/css/font-awesome.min.css'

const components = {
  bsScroll,
}

const directives = {
  // disable
}

const bsvue = {
  install(Vue) {
    Object.keys(components).forEach(item => Vue.component(components[item].name, components[item]))
    Object.keys(directives).forEach(item => Vue.directive(directives[item].name, directives[item]))
  },
  ...components,
  ...directives
}

export default bsvue
