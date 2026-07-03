DESCRIPTION: 

Wearable health monitoring systems are widely used for continuous patient monitoring by collecting vital physiological parameters such as heart rate, body temperature, and blood pressure through wearable sensor devices. These systems operate under Body Area Networking (BAN) concepts and are associated with communication standards such as IEEE 802.15.6 and ZigBee for efficient data transmission. However, due to continuous operation and close proximity to the human body, thermal buildup, energy consumption, and communication delay become critical challenges. In existing systems, sensor communication follows static routing approaches where nodes transmit data continuously without considering temperature conditions or adaptive control, and routing decisions are typically based on simple metrics such as hop count, resulting in excessive heat generation, increased power consumption, higher communication delay, and reduced device lifetime. To address these challenges, the proposed system presents a thermal-aware and adaptive communication model based on BAN concepts, where node temperature, activity levels, and communication conditions are dynamically analyzed to regulate data transmission. A temperature-aware decision mechanism controls node participation by reducing the activity of overheated or inefficient nodes while selecting optimal nodes for communication, thereby minimizing unnecessary transmissions, reducing heat generation, and improving energy utilization. The system is developed using Python, with Flask for the visualization platform, NetworkX for network modelling and routing analysis, NumPy for thermal and performance calculations, and TinyDB for storing and comparing simulation results, along with a web-based interface for network generation, path visualization, and performance evaluation. Simulation results demonstrate that the proposed system effectively reduces temperature rise, lowers energy consumption, minimizes communication delay, and improves overall network stability and reliability compared to existing approaches.

## Features

- Real-time health monitoring dashboard
- Temperature monitoring
- Sensor data visualization
- User-friendly web interface
- Data storage using TinyDB
- Lightweight Flask backend

- ## Tech Stack

- Python
- Flask
- HTML5
- CSS3
- JavaScript
- TinyDB
- NumPy
- NetworkX

- ## Project Structure

```text
Wearable Health Sensor Thermal Management Platform/
│
├── app.py
├── requirements.txt
├── Procfile
├── wsgi.py
├── db.json
├── templates/
├── static/
└── README.md
```
## Installation

```bash
git clone https://github.com/G-Agraj27/Wearable-Health-Sensor.git
cd Wearable-Health-Sensor

pip install -r requirements.txt

python app.py
```
## Usage

After starting the application, open:

http://127.0.0.1:5000

to access the dashboard.

## Future Enhancements

- AI-based health prediction
- Cloud database integration
- Mobile application
- Wearable IoT device integration
- Real-time alerts and notifications
- User authentication

- ## License

This project is developed for educational and portfolio purposes.

## Author

Agraj Nethra

GitHub:
https://github.com/G-Agraj27
