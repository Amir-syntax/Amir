document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("sliderTrack");
  const items = track.querySelectorAll(".item-pic");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const viewport = document.querySelector(".slider-viewport");

  let visibleCount = getVisibleCount();
  let index = 0;
  let autoPlayTimer = null;
  const AUTOPLAY_DELAY = 3000; // هر 3 ثانیه یک اسلاید

  function getVisibleCount() {
    return window.innerWidth <= 700 ? 1 : 2;
  }

  function getMaxIndex() {
    return Math.max(items.length - visibleCount, 0);
  }

  function getStep() {
    const item = items[0];
    const style = getComputedStyle(item);
    return (
      item.offsetWidth +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight)
    );
  }

  function isRTL() {
    return (
      getComputedStyle(document.documentElement).direction === "rtl" ||
      document.dir === "rtl" ||
      document.body.dir === "rtl"
    );
  }

  function update() {
    const step = getStep();
    const offset = index * step;

    track.style.transform = isRTL()
      ? `translateX(${offset}px)`
      : `translateX(-${offset}px)`;

    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function goNext() {
    const maxIndex = getMaxIndex();
    if (index >= maxIndex) {
      index = 0;
    } else {
      index++;
    }
    update();
  }

  function goPrev() {
    const maxIndex = getMaxIndex();
    if (index <= 0) {
      index = maxIndex;
    } else {
      index--;
    }
    update();
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(goNext, AUTOPLAY_DELAY);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  nextBtn.addEventListener("click", function () {
    goNext();
    startAutoPlay();
  });

  prevBtn.addEventListener("click", function () {
    goPrev();
    startAutoPlay();
  });

  viewport.addEventListener("mouseenter", stopAutoPlay);
  viewport.addEventListener("mouseleave", startAutoPlay);

  window.addEventListener("resize", function () {
    visibleCount = getVisibleCount();
    const maxIndex = getMaxIndex();
    if (index > maxIndex) index = maxIndex;
    update();
  });

  update();
  startAutoPlay();
});
