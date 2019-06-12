function Emitter () {
  const events = Object.create(null);

  return {
    on(type, handler) {
      (events[type] || (events[type] = [])).push(handler);
    },
    off(type, handler) {
      if (events[type]) {
        events[type].splice(events[type].indexOf(handler) >>> 0, 1);
      }
    },
    emit(type, evt) {
      (events[type] || []).slice().map(handler => { handler(evt); });
    }
  };
}

export const emitter = Emitter();
