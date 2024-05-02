"use client";
import { useState  } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import CustomInput from "@/components/UI/CustomInput";
import { countries } from "@/assets/countries";
import { states } from "@/assets/states";
import { cities } from "@/assets/cities";


const StepInstitutionData = ({formik}) => {
  


    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);


  const filterStatesByCountryId = (states, countryId) =>
    states.filter((state) => state.countryId === countryId);

  const filterCitiesByStateId = (cities, stateId) =>
    cities.filter((city) => city.stateId === stateId);

  const handleCountryChange = (e) => {
    if (e.target.value ==="")return false
    const country = countries[e.target.value];
    setSelectedCountry(country);
    formik.setFieldValue("insCountry", country.name);
    setSelectedState(null);
    formik.setFieldValue("insState", "");
    formik.setFieldValue("insCity", "");
  };

  const handleStateChange = (e) => {
    if (e.target.value ==="")return false
    const state = filterStatesByCountryId(states, selectedCountry.id).find(
      (state) => state.id === e.target.value
    );
    setSelectedState(state);
    formik.setFieldValue("insState", state.name);
    formik.setFieldValue("insCity", "");
  };

  const handleCityChange = (e) => {
    if (e.target.value ==="")return false
    const city = filterCitiesByStateId(cities, selectedState.id).find(
      (city) => city.id === e.target.value
    );
    formik.setFieldValue("insCity", city.name);
  };

  // ... rest of the component JSX (modified to use functions and Formik features)

   return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-6  ">
      <span>Enter Ins Data</span>
      <CustomInput
          label={"Name of the institution"}
          formik={formik}
          required
          fieldName={"insName"}
          labelPlace="outside"
        />
      {/* Country Select */}
      <Select
        label="country"
        variant="solid"
        labelPlacement="outside"
        isRequired
        placeholder="Select a country"
        selectionMode="single"
        items={countries  ? countries : [
          {
            id: 1,
            name: "No countries found",
          }
        ]}
        onChange={handleCountryChange}
        value={formik.values.insCountry}
        isInvalid={
          formik.errors["insCountry"] && formik.touched["insCountry"]
        }
        errorMessage={
          formik.errors["insCountry"] && formik.touched["insCountry"]
            ? formik.errors["insCountry"]
            : null
        }
        onBlur={() => formik.handleBlur("insCountry")}
      >
        {(country) => (
          <SelectItem value={country} key={country.id - 1}>
            {country.name}
          </SelectItem>
        )}
      </Select>

      <Select
        label="state"
        variant="solid"
        labelPlacement="outside"
        isRequired
        placeholder="Select a state"
        selectionMode="single"
        disabled={!selectedCountry}
        items={
          selectedCountry
            ? filterStatesByCountryId(states, selectedCountry.id)
            : [
              {
                id: 1,
                name: "No states found",
              }
            ]
        }
        onChange={handleStateChange}
        value={formik.values.insState}
        isInvalid={
          formik.errors["insState"] && formik.touched["insState"]
        }
        errorMessage={
          formik.errors["insState"] && formik.touched["insState"]
            ? formik.errors["insState"]
            : null
        }
        onBlur={() => formik.handleBlur("insState")}
      >
        {selectedCountry ? (
          (state) => (
            <SelectItem value={state.name} key={state.id}>
              {state.name}
            </SelectItem>
          )
        ) : (
          <SelectItem value="No states found">No states found</SelectItem>
        )}
      </Select>

      <Select
        label="city"
        variant="solid"
        labelPlacement="outside"
        isRequired
        placeholder="Select a city"
        selectionMode="single"
        disabled={!selectedState}
        items={
          selectedState
            ? filterCitiesByStateId(cities, selectedState.id)
            : [{
              id: 1,
              name: "No cities found",
            }]
        }
        onChange={handleCityChange}
        value={formik.values.insCity}
        isInvalid={
          formik.errors["insCity"] && formik.touched["insCity"]
        }
        errorMessage={
          formik.errors["insCity"] && formik.touched["insCity"]
            ? formik.errors["insCity"]
            : null
        }
        onBlur={() => formik.handleBlur("insCity")}
      >
        {selectedState ? (
          (city) => (
            <SelectItem value={city.name} key={city.id}>
              {city.name}
            </SelectItem>
          )
        ) : (
          <SelectItem value="No Cities found">No Cities found</SelectItem>
        )}
      </Select>
      <CustomInput
        label={"address"}
        labelPlace="outside"
        formik={formik}
        required
        fieldName={"insAddress"}/>
        <div className="flex flex-col justify-start items-start">
          <span className="text-xl first-letter:text-green-500">Country : {formik.values.insCountry}</span>
          <span className="text-xl first-letter:text-green-500">State : {formik.values.insState}</span>
          <span className="text-xl first-letter:text-green-500">Country : {formik.values.insCity}</span>
        </div>
    </div>
  );
};

export default StepInstitutionData;
