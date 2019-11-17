export function Schema (name?:string): ClassDecorator {
  return function (target) {
    name = name || target.name
    Reflect.defineMetadata('SCHEMA_NAME', name, target)
  }
}

export function Property (): PropertyDecorator {
  return function (target, key) {
    const props = Reflect.getMetadata('SCHEMA_PROPERTIES', target) || []
    props.push(key)
    Reflect.defineMetadata('SCHEMA_PROPERTIES', props, target)
  }
}