function broadcast (name, ...args) {
    return function toBroadcast (prototype, key, descriptor) {
        let oldMethod
        const newMethod = function (...thisArgs) {
            const result = this::oldMethod(...thisArgs)
            this.$broadcast(name, ...args, result)
            return result
        }
        if (descriptor.value) {
            oldMethod = descriptor.value
            descriptor.value = newMethod
        } else if (descriptor.set) {
            oldMethod = descriptor.set
            descriptor.set = newMethod
        }
    }
}

broadcast.install = function (ScopeController) {
    function $broadcast (...args) {
        if (process.env.NODE_ENV === 'development') {
            if (!this.$scope) {
                throw new Error('Should inject $scope to Controller!')
            }
        }
        return this.$scope.$broadcast(...args)
    }
    ScopeController.prototype.$broadcast = $broadcast
}


module.exports = broadcast
