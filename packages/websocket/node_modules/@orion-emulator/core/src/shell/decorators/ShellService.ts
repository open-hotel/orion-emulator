import { ShellServiceBin } from '../types';
import { ShellServicesProvider } from '../providers/services.provider';
import { getApp } from '../../lib/nest.app';

export const ShellService = (service: ShellServiceBin) => (target, key) => {
  const app = getApp()

  if (!service.main) {
    service.main = (...args) => getApp().get(target.constructor)[key](...args);
  }

  if (app) {
    const bins = app.get(ShellServicesProvider);
    bins.register(service);
    return;
  }

  ShellServicesProvider.prepare(service);
};
