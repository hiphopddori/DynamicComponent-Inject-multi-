import UIToast from '../components/popup/UIToast'
import UIAlert from '../components/popup/UIAlert'
import SsRangeCalendarLayer from '../components/popup/SsRangeCalendarLayer'
import LoginProcessManage from '../components/LoginProcessManage'

const injectComponent = (Vue, Comp, Props, isAppend = false) => {
  const ComponentClass = Vue.extend(Comp)
  const instance = new ComponentClass({
    propsData: Props,
    router: Plugin.router,
    store: Plugin.store
  })
  instance.$mount()
  console.log('instance::', instance, instance.$root, instance.$root.$el)
  if (isAppend) document.getElementById('app').appendChild(instance.$el)
  // document.body.appendChild(instance.$el) // App.vue에 등록되어있는 컴포넌트(z-index) 때문에 같은 영역에 있어야해서 id='app'에 append
  return instance
}

/*
const removeElement = (el) => {
  const elem = el.$el
  el.$destroy()
  el.$off()
  elem.remove()
}
*/

const Plugin = {
  store: null,
  router: null,
  install (Vue, option = {}) {
    if (this.installed) return
    this.installed = true
    const toast = toastPlugin(Vue)
    const alert = alertPlugin(Vue, 'alert')
    const confirm = alertPlugin(Vue, 'confirm')
    const rangeCalendar = rangeCalendarPlugin(Vue)
    const loginProcessManage = LoginProcessManagePlugin(Vue)
    Vue.prototype.$toast = toast.methods
    Vue.prototype.$alert = alert.methods
    Vue.prototype.$confirm = confirm.methods
    Vue.prototype.$rangeCalendar = rangeCalendar.methods
    Vue.prototype.$loginPopup = loginProcessManage.methods
    this.store = option.store
    this.router = option.router
  }
}

const toastPlugin = (Vue) => {
  const methods = (options) => {
    const defaultOptions = {}

    if (typeof options === 'string' || typeof options === 'number') { // message 만
      defaultOptions.message = options
      options = {}
    }
    const propsData = Object.assign(defaultOptions, options)
    injectComponent(Vue, UIToast, propsData, true)
  }
  return {
    methods
  }
}

const alertPlugin = (Vue, type) => {
  const methods = (message, title = '', options = {}) => {
    console.log(typeof message)
    const defaultOptions = {}
    defaultOptions.type = type
    defaultOptions.message = message
    defaultOptions.title = title

    const propsData = Object.assign(defaultOptions, options)
    const instance = injectComponent(Vue, UIAlert, propsData)
    return instance.open()
  }
  return {
    methods
  }
}

const rangeCalendarPlugin = (Vue) => {
  const methods = (options = {}) => {
    const defaultOptions = {
      addMonth: 2,
      holidays: null
    }
    const propsData = Object.assign(defaultOptions, options)
    if (options.startDay && options.endDay) {
      propsData.value = {
        startDay: options.startDay,
        endDay: options.endDay
      }
    }
    injectComponent(Vue, SsRangeCalendarLayer, propsData)
  }
  return {
    methods
  }
}

const LoginProcessManagePlugin = (Vue, router) => {
  const methods = (options = {}) => {
    const instance = injectComponent(Vue, LoginProcessManage, options, true)
    return instance.open()
  }
  return {
    methods
  }
}
export default Plugin
