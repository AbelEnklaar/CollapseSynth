/**
 * 
 * Face Tracker Utility —
 * You can mostly ignore this file and use it as a utility.
 *
 */

(() => {
  window.createFaceTracker = createFaceTracker;
  function createFaceTracker (opt = {}) {
    let ctrack;
    let url = opt.url;
    let capture;
    if (url) {
      capture = createVideo(opt.url, () => {
        capture.loop();
      });
    } else {
      capture = createCapture(VIDEO);
    }
    capture.hide();

    return {
      draw (fn) {
        if (!ctrack && capture.loadedmetadata) {
          ctrack = new window.clm.tracker();
          ctrack.init();
          ctrack.start(capture.elt);
        }
        drawFaceVideo(capture, ctrack, fn, opt);
      },
      get loaded () {
        return ctrack && capture.loadedmetadata;
      },
      resize () {
        if (ctrack) {
          ctrack.stop();
          ctrack.reset();
        }
        ctrack = null;
        capture.size(width, height);
      }
    };
  }

  function drawFaceVideo(capture, ctrack, fn, opt = {}) {
    const {
      scale = 1,
      offsetX = 0.5,
      offsetY = 0.5
    } = opt;
    const contains = opt.contain;
    const video = capture.elt;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const parentWidth = width;
    const parentHeight = height;

    const childRatio = videoWidth / videoHeight;
    const parentRatio = parentWidth / parentHeight;
    let resultWidth = parentWidth * scale;
    let resultHeight = parentHeight * scale;

    if (contains ? childRatio > parentRatio : childRatio < parentRatio) {
      resultHeight = resultWidth / childRatio;
    } else {
      resultWidth = resultHeight * childRatio;
    }

    const x = (parentWidth - resultWidth) * offsetX;
    const y = (parentHeight - resultHeight) * offsetY;

    let face;
    let score = 0;
    if (ctrack) {
      score = ctrack.getScore();
      const position = ctrack.getCurrentPosition();
      if (score > 0 && position) {
        face = position.map(p => {
          return {
            x: x + (p[0] / video.width) * resultWidth,
            y: y + (p[1] / video.height) * resultHeight
          };
        });
      }
    }
    
    if (opt.drawVideo !== false) {
      image(capture, x, y, resultWidth, resultHeight);
    }

    if (fn) {
      fn(face, score, x, y, resultWidth, resultHeight);
    }
  }
})();
