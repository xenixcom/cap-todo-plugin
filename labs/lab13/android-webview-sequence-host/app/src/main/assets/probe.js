window.addEventListener("load", async () => {
  window.AndroidProbe.onResult("boot");
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.AndroidProbe.onResult("open");
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.AndroidProbe.onResult("data:1");
  await new Promise((resolve) => setTimeout(resolve, 40));
  window.AndroidProbe.onResult("data:2");
  await new Promise((resolve) => setTimeout(resolve, 40));
  window.AndroidProbe.onResult("data:3");
  await new Promise((resolve) => setTimeout(resolve, 40));
  window.AndroidProbe.onResult("closed");
});
