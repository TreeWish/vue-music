import { ref } from 'vue';
import animations from 'create-keyframe-animation';
export default function useAnmiation() {
  const cdWrapperRef = ref(null);
  // 判断当前动画
  let entering = false;
  let leaving = false;

  function enter(el, done) {
    if (leaving) {
      afterLeave();
    }
    entering = true;
    const { x, y, scale } = getPosAndScale();
    const anmiation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    };
    animations.registerAnimation({
      name: 'move',
      anmiation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    });
    animations.runAnimation(cdWrapperRef.value, 'move', done);
  }
  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move');
    cdWrapperRef.value.style.anmiation = '';
  }
  function leave(el, done) {
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale();
    const cdWrapperEl = cdWrapperRef.value;

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)';
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    cdWrapperEl.addEventListener('transitionend', next);

    function next() {
      cdWrapperEl.removeEventListener('transitionend', next);
      done();
    }
  }
  function afterLeave() {
    leaving = false
    const cdWrapperEl = cdWrapperRef.value;
    cdWrapperEl.style.anmiation = '';
    cdWrapperEl.style.transform = '';
  }

  // 计算偏移量和缩放值
  function getPosAndScale() {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    const scale = targetWidth / width;

    return {
      x,
      y,
      scale
    };
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  };
}
