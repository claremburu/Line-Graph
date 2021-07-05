import * as CSV from "csv-string";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineGraph = () => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState({ x: {}, y: {} });

  // Handle csv string...
  const handleSubmit = (event) => {
    // Sample csv...
    /*

    0,1,2 
     date, amount, spent
    2019-01-01, 10,100 
    2019-01-02, 20, 200
    */
    event.preventDefault();
    const { csv } = event.target.elements;
    const csvArray = CSV.parse(csv.value);

    // Get headers....
    const headers = csvArray[0];
    // Remove headers from list...
    csvArray.splice(0, 1);
    const refinedList = [];
    // Now get values for each colums aka headers
    headers.forEach((header, index) => {
      // Item list for each column aka header...
      const values = [];
      // Get items from the rows at index of header..
      csvArray.forEach((row) => {
        values.push(row[index].trim());
      });
      // Now push to refined list of colums...
      refinedList.push({
        name: header.trim(),
        values: values,
      });
    });

    // console.log(refinedList);
    // Set state...
    setList(refinedList);
  };

  // Handle selection....
  const handleSelection = (event) => {
    event.preventDefault();
    const { x, y } = event.target.elements;
    // Find selected item...
    const x_list = list.find((el) => el.name === x.value);
    const y_list = list.find((el) => el.name === y.value);
    // Set selected x & y...
    setSelected({
      x: x_list,
      y: y_list,
    });
  };

  const options = {
    title: {
      text: "My chart",
    },
    xAxis: {
      title: {
        text: selected.x.name ? selected.x.name : "X-Axis",
      },
      categories: selected.x.values ? selected.x.values : [],
    },

    yAxis: {
      title: {
        text: selected.y.name ? selected.y.name : "Y-Axis",
      },
    },
    // Hast to be integers...
    series: [
      {
        data: selected.y.values
          ? selected.y.values.map((el) => Number(el))
          : [],
      },
    ],
  };

  return (
    <section className="line-page">
      <h1>Line Graph</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="csv"
          placeholder="Paste csv here...."
          rows={10}
          required
        ></textarea>
        <button type="submit">Process</button>
      </form>

      <form style={{ marginTop: 30 }} onSubmit={handleSelection}>
        <select name="x" required>
          <option>X AXIS</option>
          {list.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <select name="y" required>
          <option>Y AXIS</option>
          {list.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <button type="submit">Apply</button>
      </form>
      <section style={{ marginTop: 20 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </section>
    </section>
  );
};

export default LineGraph;
