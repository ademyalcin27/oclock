export const accurateInterval = (fn, time) => {
    let cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    
    wrapper = () => {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = () => clearTimeout(timeout);

    timeout = setTimeout(wrapper, nextAt - new Date().getTime());

    return {
      cancel: cancel
    };
  };