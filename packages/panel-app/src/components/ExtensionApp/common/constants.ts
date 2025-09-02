export const loaderStyle = `
[list-app-loader] {
  border: 0;
  width: 100%;
  height: 1px;
  background: transparent;
  position: absolute;
  bottom: -1px;
  overflow: visible;
  display: block;
  margin: 0;
  z-index: 10;
}

[list-app-loader]:after {
  content: '';
  width: 50%;
  height: 1px;
  position: absolute;
  background: linear-gradient(
    90deg,
    transparent 0%,
    oklch(65.6% 0.241 354.308) 40%,
    transparent 100%
  );
  top: -1px;
  opacity: 0;
  animation-duration: 1.5s;
  animation-delay: 1s;
  animation-timing-function: ease;
  animation-name: listAppLoading;
  animation-iteration-count: infinite;
}

@keyframes listAppLoading {
  0% {
    opacity: 0;
    transform: translateX(0);
  }

  50% {
    opacity: 1;
    transform: translateX(100%);
  }

  100% {
    opacity: 0;
    transform: translateX(0);
  }
}
`
