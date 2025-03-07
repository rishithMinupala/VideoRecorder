let video = document.querySelector(".video");
let recodrCont = document.querySelector(".record-cont");
let recodrBtn = document.getElementById("record-btn");
let captureCont = document.querySelector(".capture-cont");
let captureBtn = document.querySelector(".capture-btn");
let filtersCont = document.querySelector(".filters-cont");
let timer = document.querySelector(".timer");

let recorder;
let chunks = [];
let isRecording = false;
let timerId;
let secondsCounter = 0;

const userData = {
  //video: { frameRate: { ideal: 60 } },
  audio: false,
};



//timer function
const counter = () => {
  let hours = parseInt(secondsCounter / 3600);
  secondsCounter = secondsCounter % 3600;
  let minutes = parseInt(secondsCounter / 60);
  let seconds = secondsCounter % 60;

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  timer.textContent = `${hours}:${minutes}:${seconds}`;
  secondsCounter += 1;
};

const startTimer = () => {
  timer.style.display = "block";
  timerId = setInterval(counter, 1000);
};

const stopTimer = () => {
  clearInterval(timerId);
  timer.textContent = "00:00:00";
  timer.style.display = "none";
  secondsCounter = 0;
};

//video stream function
const getVideo = async () => {
  let stream = await navigator.mediaDevices.getUserMedia(userData);
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);

  recorder.onstart = (e) => {
    chunks = [];
  };
  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };
  recorder.onstop = (e) => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = videoUrl;
    a.download = "stream.mp4";
    a.click();
  };

  recodrCont.onclick = (e) => {
    if (!recorder) return;
    isRecording = !isRecording;
    if (isRecording) {
      recorder.start();
      startTimer();
      recodrBtn.classList.remove("record-btn");
      recodrBtn.classList.add("recording-btn");
      recodrBtn.classList.add("scale-record");
    } else {
      recorder.stop();
      stopTimer();
      recodrBtn.classList.remove("scale-record");
      recodrBtn.classList.remove("recording-btn");
      recodrBtn.classList.add("record-btn");
    }
  };
};

captureCont.onclick = (e) => {
  captureBtn.classList.add("scale-capture");
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  let imageUrl = canvas.toDataURL("image/png");

  let a = document.createElement("a");
  a.href = imageUrl;
  a.download = "screenshot.jpg";
  //a.target = "_blank";
  //window.location.href = imageUrl;
  a.click();

  setTimeout(() => captureBtn.classList.remove("scale-capture"), 500);
};

//navigator.mediaDevices.getUserMedia(userData).then((live) => {
//  video.srcObject = live;
//});

getVideo();
