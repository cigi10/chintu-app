import Navbar from "@/components/Navbar";
import "@/styles/blog.css";
import "@/styles/resources.css";

export const metadata = {
  title: "Unit Conversions Reference - Studyloaf",
  description: "Common unit conversions for physics and chemistry: length, mass, time, energy, and SI prefixes.",
  openGraph: {
    title: "Unit Conversions Reference - Studyloaf",
    description: "Common unit conversions for physics and chemistry: length, mass, time, energy, and SI prefixes.",
  },
};

export default function UnitConversionsPage() {
  return (
    <>
      <Navbar />
      <div className="blog-shell">
        <article className="blog-post">
          <h1 className="blog-post-title">Unit Conversions Reference</h1>

          <div className="blog-post-section">
            <p className="blog-post-p">
              A quick reference for the unit conversions that come up most often in physics and
              chemistry. Values marked with &asymp; are standard rounded approximations; everything
              else is exact by definition.
            </p>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Length</h2>
            <table className="resource-table">
              <thead>
                <tr><th>Unit</th><th>Equals</th></tr>
              </thead>
              <tbody>
                <tr><td>1 kilometer</td><td>1000 meters</td></tr>
                <tr><td>1 meter</td><td>100 centimeters</td></tr>
                <tr><td>1 centimeter</td><td>10 millimeters</td></tr>
                <tr><td>1 inch</td><td>2.54 centimeters</td></tr>
                <tr><td>1 foot</td><td>12 inches (30.48 centimeters)</td></tr>
                <tr><td>1 mile</td><td>&asymp; 1.609 kilometers</td></tr>
                <tr><td>1 nanometer</td><td>10<sup>-9</sup> meters</td></tr>
                <tr><td>1 angstrom</td><td>10<sup>-10</sup> meters</td></tr>
              </tbody>
            </table>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Mass</h2>
            <table className="resource-table">
              <thead>
                <tr><th>Unit</th><th>Equals</th></tr>
              </thead>
              <tbody>
                <tr><td>1 kilogram</td><td>1000 grams</td></tr>
                <tr><td>1 gram</td><td>1000 milligrams</td></tr>
                <tr><td>1 metric ton (tonne)</td><td>1000 kilograms</td></tr>
                <tr><td>1 pound</td><td>&asymp; 0.4536 kilograms</td></tr>
                <tr><td>1 atomic mass unit (u)</td><td>&asymp; 1.66 &times; 10<sup>-27</sup> kilograms</td></tr>
              </tbody>
            </table>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Time</h2>
            <table className="resource-table">
              <thead>
                <tr><th>Unit</th><th>Equals</th></tr>
              </thead>
              <tbody>
                <tr><td>1 minute</td><td>60 seconds</td></tr>
                <tr><td>1 hour</td><td>60 minutes (3600 seconds)</td></tr>
                <tr><td>1 day</td><td>24 hours (86,400 seconds)</td></tr>
                <tr><td>1 year (365 days)</td><td>&asymp; 3.15 &times; 10<sup>7</sup> seconds</td></tr>
              </tbody>
            </table>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Energy</h2>
            <table className="resource-table">
              <thead>
                <tr><th>Unit</th><th>Equals</th></tr>
              </thead>
              <tbody>
                <tr><td>1 calorie</td><td>4.184 joules</td></tr>
                <tr><td>1 kilocalorie (food Calorie)</td><td>4184 joules</td></tr>
                <tr><td>1 electronvolt (eV)</td><td>&asymp; 1.602 &times; 10<sup>-19</sup> joules</td></tr>
                <tr><td>1 kilowatt-hour (kWh)</td><td>3.6 &times; 10<sup>6</sup> joules</td></tr>
              </tbody>
            </table>
          </div>

          <div className="blog-post-section">
            <h2 className="blog-post-heading">Common SI prefixes</h2>
            <table className="resource-table">
              <thead>
                <tr><th>Prefix</th><th>Symbol</th><th>Factor</th></tr>
              </thead>
              <tbody>
                <tr><td>giga</td><td>G</td><td>10<sup>9</sup></td></tr>
                <tr><td>mega</td><td>M</td><td>10<sup>6</sup></td></tr>
                <tr><td>kilo</td><td>k</td><td>10<sup>3</sup></td></tr>
                <tr><td>centi</td><td>c</td><td>10<sup>-2</sup></td></tr>
                <tr><td>milli</td><td>m</td><td>10<sup>-3</sup></td></tr>
                <tr><td>micro</td><td>&micro;</td><td>10<sup>-6</sup></td></tr>
                <tr><td>nano</td><td>n</td><td>10<sup>-9</sup></td></tr>
                <tr><td>pico</td><td>p</td><td>10<sup>-12</sup></td></tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </>
  );
}
