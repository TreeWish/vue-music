import { ref } from 'vue';

export default function useMiddleInteractive() {
  const currentShow = ref('cd');
  const middleLStyle = ref(null);
  const middleRStyle = ref(null);

  const touch = {};
  let currentView = 'cd';

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX;
    touch.startY = e.touches[0].pageY;
    // 设置方向锁
    touch.directionLocked = '';
  }
  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.startX;
    const deltaY = e.touches[0].pageY - touch.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX > absDeltaY ? 'h' : 'v';
    }
    if (touch.directionLocked === 'v') {
      return;
    }
    const left = currentView === 'cd' ? 0 : -window.innerWidth;
    // 计算偏移量
    const offsetWidth = left + deltaX;
    // 计算当前偏移百分比
    touch.percent = Math.abs(offsetWidth / innerWidth);

    // 根据拖动百分比设置当前显示视图
    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric';
      } else {
        currentShow.value = 'cd';
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd';
      } else {
        currentShow.value = 'lyric';
      }
    }

    // 设置当前Style
    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    };
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    };
  }
  function onMiddleTouchEnd() {
    let opacity;
    let offsetWidth;
    if (currentShow.value === 'cd') {
      currentView = 'cd';
      offsetWidth = 0;
      opacity = 1;
    } else {
      currentView = 'lyric';
      offsetWidth = -window.innerWidth;
      opacity = 0;
    }

    // 设置当前Style
    middleLStyle.value = {
      opacity,
      transitionDuration: '300ms'
    };
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '300ms'
    };
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  };
}
