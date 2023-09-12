import './App.css';
import { collection, query, onSnapshot } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { db } from './firebase';
import { useState } from 'react';

function App() {
  const [labels, setLabels] = useState([]);
  const [beers, setBeers] = useState([]);

  const q = query(collection(db, "persons"));
  onSnapshot(q, (querySnapshot) => {
    let newData = new Map();
    const newLabels = [];
    const newBeers = [];
    querySnapshot.forEach((doc) => {
      newData.set(doc.data().name, doc.data().beers);
    });
    newData = new Map([...newData.entries()].sort());
    newData.forEach((beers, name) => {
      newLabels.push(name);
      newBeers.push(beers);
    })
    if (JSON.stringify(newLabels) != JSON.stringify(labels) || JSON.stringify(newBeers) != JSON.stringify(beers)) {
      setLabels(newLabels);
      setBeers(newBeers);
    }
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'DrinkChart 2023™',
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Drinks',
        data: beers,
        backgroundColor: 'rgba(103, 58, 183, 1)',
      },
    ],
  };

  return (
    <div className="App">
      <Bar data={data} options={options} />
    </div>
  );
}

export default App;
