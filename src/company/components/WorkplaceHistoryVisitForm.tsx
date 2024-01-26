// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const dayValidationSchema = (daysOfWeek: string[]) =>
//   Yup.object().shape(
//     daysOfWeek.reduce((schema, day) => {
//       schema[day] = Yup.string();
//       return schema;
//     }, {} as { [key: string]: any })
//   );

// const schema = Yup.object().shape({
//   persons: Yup.array().of(
//     Yup.object().shape({
//       name: Yup.string().required('Name is required'),
//       occupation: Yup.string().required('Occupation is required'),
//       employment: Yup.string().required('Employment is required'),
//       weeks: Yup.array().of(
//         Yup.object().shape({
//           weekNumber: Yup.number().required('Week number is required'),
//           days: dayValidationSchema(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
//         })
//       ),
//     })
//   ),
// });


// const getMonthDays = () => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth();
//   const nextMonth = (currentMonth + 1) % 12;
//   const nextMonthDate = new Date(currentDate.getFullYear(), nextMonth, 0);
//   return nextMonthDate.getDate();
// };

// const MyForm = () => {
//   const [monthDays, setMonthDays] = useState(getMonthDays());

//   const formik = useFormik({
//     initialValues: {
//       persons: [
//         {
//           name: "",
//           occupation: "",
//           employment: "",
//           weeks: Array.from({ length: 4 }, (_, i) => ({
//             weekNumber: i + 1,
//             days: {
//               monday: "",
//               tuesday: "",
//               // Initialize other weekdays
//             },
//           })),
//         },
//       ],
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       // Handle form submission
//       console.log(values);
//     },
//   });

//   const handleAddPerson = () => {
//     formik.setValues({
//       ...formik.values,
//       persons: [
//         ...formik.values.persons,
//         {
//           name: "",
//           occupation: "",
//           employment: "",
//           weeks: Array.from({ length: 4 }, (_, i) => ({
//             weekNumber: i + 1,
//             days: {
//               monday: "",
//               tuesday: "",
//               wednesday: "",
//               thursday: "",
//               friday: "",
//               saturday: "",
//               sunday: "",
//             },
//           })),
//         },
//       ],
//     });
//   };

//   const handleRemovePerson = (index: number) => {
//     const updatedPersons = [...formik.values.persons];
//     updatedPersons.splice(index, 1);
//     formik.setValues({ ...formik.values, persons: updatedPersons });
//   };

//   return (
//     // <form onSubmit={formik.handleSubmit}>
//     //   {formik.values.persons.map((person, personIndex) => (
//     //     <div key={personIndex}>
//     //       <h2>Person {personIndex + 1}</h2>
//     //       <input
//     //         type="text"
//     //         name={`persons[${personIndex}].name`}
//     //         placeholder="Name"
//     //         onChange={formik.handleChange}
//     //         value={formik.values.persons[personIndex].name}
//     //       />
//     //       {/* Add similar fields for occupation and employment */}
//     //       {person.weeks.map((week, weekIndex) => (
//     //         <div key={weekIndex}>
//     //           <h3>Week {weekIndex + 1}</h3>
//     //           {Object.keys(week.days).map((day) => (
//     //             <input
//     //               key={day}
//     //               type="text"
//     //               name={`persons[${personIndex}].weeks[${weekIndex}].days.${day}`}
//     //               placeholder={`${day} (${weekIndex * 7 + monthDays + 1})`}
//     //               onChange={formik.handleChange}
//     //               value={
//     //                 formik.values.persons[personIndex].weeks[weekIndex].days[
//     //                   day
//     //                 ]
//     //               }
//     //             />
//     //           ))}
//     //         </div>
//     //       ))}
//     //       <button type="button" onClick={() => handleRemovePerson(personIndex)}>
//     //         Remove Person
//     //       </button>
//     //     </div>
//     //   ))}
//     //   <button type="button" onClick={handleAddPerson}>
//     //     Add Person
//     //   </button>
//     //   <button type="submit">Submit</button>
//     // </form>
// //   );
//   )
// };

// export default MyForm;

const sample = () => {
    return (<></>)
}

export default sample;