export default class Alert {
  //Steven Savarin W03
  constructor(jsonPath = "./alerts.json") {
    this.jsonPath = jsonPath;
    this.alerts = [];
    this.currentIndex = 0;
  }

  async init() {
    try {
      const res = await fetch(this.jsonPath);
      this.alerts = await res.json();

      if (this.alerts.length > 0) {
        this.buildContainer();
        this.showAlert();
        setInterval(() => this.showAlert(), 1500);
      }
    } catch (err) {
      console.error("Failed to load alerts:", err);
    }
  }

  buildContainer() {
    this.container = document.createElement("section");
    this.container.className = "alert-list";
    this.alertElement = document.createElement("p");
    this.alertElement.className = "alert-message";
    this.container.appendChild(this.alertElement);

    const main = document.querySelector("main");
    if (main) {
      main.prepend(this.container);
    }
  }

  showAlert() {
    const alert = this.alerts[this.currentIndex];
    this.alertElement.textContent = alert.message;
    this.alertElement.style.background = alert.background;
    this.alertElement.style.color = alert.color;

    this.currentIndex = (this.currentIndex + 1) % this.alerts.length;
  }
}
//Steven Savarin W03
