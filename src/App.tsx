import { useState } from 'react'
import type { SubmitEventHandler } from "react";
import './App.css'

type BasicFormState = {
  year: string;
  make: string;
  model: string;
  vin: string;
  color: string;
  panelDamage: PanelDamage[];
};

type SubmittedReport = {
  year: string;
  make: string;
  model: string;
  vin: string | null;
  color: string;
  panelDamage: SubmittedPanelDamage[];
};

type PanelName = 
  | "Hood"
  | "Roof"
  | "Front Left Door"
  | "Front Right Door"
  | "Rear Left Door"
  | "Rear Right Door"
  | "Trunk"
  | "Deck Lid"
  | "Left Quarter Panel"
  | "Right Quarter Panel"
  | "Left Fender"
  | "Right Fender";

type DentSize =
  | "Small"
  | "Medium"
  | "Large"
  | "Oversized"
 
type Severity =
  | "Light"
  | "Moderate"
  | "Heavy"

interface PanelDamage {
  panel: PanelName;
  dentCount: string;
  averageDentSize: DentSize | "",
  severity: Severity | "",
}

interface SubmittedPanelDamage {
  panel: PanelName;
  dentCount: number;
  averageDentSize: DentSize;
  severity: Severity;
}

function createInitialFormState(): BasicFormState {
  return {
    year: "",
    make: "",
    model: "",
    vin: "",
    color: "",
    panelDamage: [],
  };
}

export default function App() {
  const [formData, setFormData] = useState<BasicFormState>(createInitialFormState);
  const [panelToAdd, setPanelToAdd] = useState<PanelName | "">("");
  const [submittedReport, setSubmittedReport] = useState<SubmittedReport | null>(null);
  
  const updateField = (
    field: keyof BasicFormState,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addPanel = () => {
    if (!panelToAdd) {
      return;
    }

    const alreadySelected = formData.panelDamage.some(
      (damage) => damage.panel === panelToAdd
    );

    if (alreadySelected) {
      return;
    }

    setFormData((current) => ({
      ...current,
      panelDamage: [
        ...current.panelDamage,
        {
          panel: panelToAdd,
          dentCount: "",
          averageDentSize: "",
          severity: "",
        },
      ],
    }));

    setPanelToAdd("");
  };

  const updatePanelDamage = (
    panel: PanelName,
    field: keyof Omit<PanelDamage, "panel">,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      panelDamage: current.panelDamage.map((damage) =>
        damage.panel === panel
          ? {
            ...damage,
            [field]: value,
            }
          : damage
      ),
    }));
  };

  const hasEnoughPanels = formData.panelDamage.length >= 3;

  const hasAllPanelDetails = 
    formData.panelDamage.every(
      (damage) =>
        damage.dentCount !== "" &&
        Number(damage.dentCount) >= 1 &&
        Number(damage.dentCount) <= 100 &&
        damage.averageDentSize !== "" &&
        damage.severity !== ""
    );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (
    event
  ) => {
    event.preventDefault();

    const submittedData: SubmittedReport = {
      ...formData,

      year: formData.year.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      vin: formData.vin?.trim() || null,
      color: formData.color.trim(),

      panelDamage: formData.panelDamage.map((damage) => ({
        panel: damage.panel,
        dentCount: Number(damage.dentCount),
        averageDentSize: damage.averageDentSize as DentSize,
        severity: damage.severity as Severity,
      })),
    };
    
    setSubmittedReport(submittedData);
    setFormData(createInitialFormState());
  };

  const isSubmitDisabled =
    !formData.year.trim() ||
    !formData.make.trim() ||
    !formData.model.trim() ||
    !formData.color.trim() ||
    !hasEnoughPanels ||
    !hasAllPanelDetails;

    return (
      <main className="main">
        <h1>Damage Report</h1>
        
        
        <form className="damage-form" onSubmit={handleSubmit}>
          <h2>Vehicle Info</h2>
          <div className="vehicle-info">
            <label htmlFor="year">
              Year
            </label>

            <input
              id="year"
              type="text"
              value={formData.year}
              onChange={(event) =>
                updateField("year", event.target.value)
              }
              required
            />
          </div>
          
          <div className="vehicle-info">
            <label htmlFor="make">
              Make
            </label>

            <input
              id="make"
              type="text"
              value={formData.make}
              onChange={(event) =>
                updateField("make", event.target.value)
              }
              required
            />
          </div>

          <div className="vehicle-info">
            <label htmlFor="model">
              Model
            </label>

            <input
              id="model"
              type="text"
              value={formData.model}
              onChange={(event) =>
                updateField("model", event.target.value)
              }
              required
            />
          </div>

          <div className="vehicle-info">
            <label htmlFor="vin">
              VIN <span>(optional)</span>
            </label>

            <input
              id="vin"
              type="text"
              value={formData.vin}
              onChange={(event) =>
                updateField("vin", event.target.value)
              }
            />
          </div>

          <div className="vehicle-info">
            <label htmlFor="color">
              Color
            </label>

            <input
              id="color"
              type="text"
              value={formData.color}
              onChange={(event) =>
                updateField("color", event.target.value)
              }
              required
            />
          </div>
          
          <h2>Damage</h2>
          <div>
            <p>Select at least 3 panels</p>
            <select
              value={panelToAdd}
              onChange={(event) =>
                setPanelToAdd(event.target.value as PanelName | "")
              }
            >
              <option value="">Select a panel</option>
              <option value="Hood">Hood</option>
              <option value="Roof">Roof</option>
              <option value="Front Left Door">Front Left Door</option>
              <option value="Front Right Door">Front Right Door</option>
              <option value="Rear Left Door">Rear Left Door</option>
              <option value="Rear Right Door">Rear Right Door</option>
              <option value="Trunk">Trunk</option>
              <option value="Deck Lid">Deck Lid</option>
              <option value="Left Quarter Panel">Left Quarter Panel</option>
              <option value="Right Quarter Panel">Right Quarter Panel</option>
              <option value="Left Fender">Left Fender</option>
              <option value="Right Fender">Right Fender</option>
            </select>
            <button
              className="add-panel-button"
              type="button"
              onClick={addPanel}
              disabled={!panelToAdd}
            >
              Add Panel
            </button>
            
          </div>

          {formData.panelDamage.map((damage) => (
            <section key={damage.panel}>
              <h3>{damage.panel}</h3>

              <div className="panel-field">
                <label htmlFor={`${damage.panel}-dent-count`}>
                  Number of dents 
                </label>

                <input
                  id={`${damage.panel}-dent-count`}
                  type="number"
                  min="1"
                  max="100"
                  value={damage.dentCount}
                  onChange={(event) =>
                    updatePanelDamage(
                      damage.panel,
                      "dentCount",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="panel-field"> 
                <label htmlFor={`${damage.panel}-dent-size`}>
                  Average dent size
                </label>  
                <select
                  id={`${damage.panel}-dent-size`}
                  value={damage.averageDentSize}
                  onChange={(event) =>
                    updatePanelDamage(
                      damage.panel,
                      "averageDentSize",
                      event.target.value
                    )
                  }
                  required
                >
                  <option value="">Select a size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Oversized">Oversized</option>
                </select>
              </div>
              
              <div className="panel-field">
                <label htmlFor={`${damage.panel}-severity`}>
                  Severity
                </label>

                <select
                  id={`${damage.panel}-severity`}
                  value={damage.severity}
                  onChange={(event) =>
                    updatePanelDamage(
                      damage.panel,
                      "severity",
                      event.target.value
                    )
                  }
                  required
                >
                  <option value="">Select severity</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>
            </section>
          ))}

          <button
            className="submit-button"
            type="submit"
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </form>
               
        {submittedReport && (
          <section>
            <h2>Report Summary</h2>
            
            <h3>Vehicle</h3>
            <div className="summary-field">
              <p>
                <strong>Year:</strong>{" "}
                {submittedReport.year}
              </p>

              <p>
                <strong>Make:</strong>{" "}
                {submittedReport.make}
              </p>

              <p>
                <strong>Model:</strong>{" "}
                {submittedReport.model}
              </p>

              <p>
                <strong>VIN:</strong>{" "}
                {submittedReport.vin ?? "Not provided"}
              </p>

              <p>
                <strong>Color:</strong>{" "}
                {submittedReport.color}
              </p>
            </div>
            
            <h3>Panels</h3>

            {submittedReport.panelDamage.map((damage) => (
              <div className="summary-field" key={damage.panel}>
                <h4>{damage.panel}</h4>

                <p>
                  <strong>Number of dents:</strong>{" "}
                  {damage.dentCount}
                </p>

                <p>
                  <strong>Average dent size:</strong>{" "}
                  {damage.averageDentSize}
                </p>

                <p>
                  <strong>Severity:</strong>{" "}
                  {damage.severity}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    )
}