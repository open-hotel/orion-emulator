"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_provider_1 = require("../providers/services.provider");
const nest_app_1 = require("../../lib/nest.app");
exports.ShellService = (service) => (target, key) => {
    const app = nest_app_1.getApp();
    if (!service.main) {
        service.main = (...args) => nest_app_1.getApp().get(target.constructor)[key](...args);
    }
    if (app) {
        const bins = app.get(services_provider_1.ShellServicesProvider);
        bins.register(service);
        return;
    }
    services_provider_1.ShellServicesProvider.prepare(service);
};
//# sourceMappingURL=ShellService.js.map