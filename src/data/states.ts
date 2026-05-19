export type StateInfo = {
  code: string;
  name: string;
  slug: string;
  rate: number;
  note: string;
};

const rows: Array<[string, string, number, string]> = [
  ["AL", "Alabama", 0.05, "Alabama has a graduated income tax; this app uses a conservative top-rate estimate."],
  ["AK", "Alaska", 0, "Alaska has no broad state income tax."],
  ["AZ", "Arizona", 0.025, "Arizona generally uses a flat individual income tax rate."],
  ["AR", "Arkansas", 0.039, "Arkansas uses graduated rates; this app estimates with the top ordinary rate."],
  ["CA", "California", 0.093, "California has graduated rates; higher earners may owe more than this planning estimate."],
  ["CO", "Colorado", 0.044, "Colorado generally uses a flat individual income tax rate."],
  ["CT", "Connecticut", 0.055, "Connecticut uses graduated income tax rates."],
  ["DE", "Delaware", 0.066, "Delaware uses graduated income tax rates."],
  ["DC", "District of Columbia", 0.085, "DC uses graduated income tax rates."],
  ["FL", "Florida", 0, "Florida has no broad state income tax."],
  ["GA", "Georgia", 0.0539, "Georgia generally uses a flat individual income tax rate."],
  ["HI", "Hawaii", 0.0825, "Hawaii uses graduated income tax rates."],
  ["ID", "Idaho", 0.058, "Idaho generally uses a flat individual income tax rate."],
  ["IL", "Illinois", 0.0495, "Illinois uses a flat individual income tax rate."],
  ["IN", "Indiana", 0.0305, "Indiana uses a flat state rate; local taxes may also apply."],
  ["IA", "Iowa", 0.044, "Iowa has moved toward flatter income tax rates; this is a planning estimate."],
  ["KS", "Kansas", 0.057, "Kansas uses graduated income tax rates."],
  ["KY", "Kentucky", 0.04, "Kentucky generally uses a flat individual income tax rate."],
  ["LA", "Louisiana", 0.0425, "Louisiana uses graduated income tax rates."],
  ["ME", "Maine", 0.0715, "Maine uses graduated income tax rates."],
  ["MD", "Maryland", 0.0575, "Maryland state and local taxes vary; this uses the state top-rate estimate."],
  ["MA", "Massachusetts", 0.05, "Massachusetts generally uses a flat individual income tax rate, with surtax rules for high incomes."],
  ["MI", "Michigan", 0.0425, "Michigan generally uses a flat individual income tax rate."],
  ["MN", "Minnesota", 0.0785, "Minnesota uses graduated income tax rates."],
  ["MS", "Mississippi", 0.044, "Mississippi uses graduated income tax rates."],
  ["MO", "Missouri", 0.048, "Missouri uses graduated income tax rates."],
  ["MT", "Montana", 0.059, "Montana uses graduated income tax rates."],
  ["NE", "Nebraska", 0.0584, "Nebraska uses graduated income tax rates."],
  ["NV", "Nevada", 0, "Nevada has no broad state income tax."],
  ["NH", "New Hampshire", 0, "New Hampshire has no broad wage income tax."],
  ["NJ", "New Jersey", 0.0637, "New Jersey uses graduated income tax rates."],
  ["NM", "New Mexico", 0.049, "New Mexico uses graduated income tax rates."],
  ["NY", "New York", 0.0685, "New York uses graduated rates; local NYC/Yonkers taxes are not included."],
  ["NC", "North Carolina", 0.0425, "North Carolina generally uses a flat individual income tax rate."],
  ["ND", "North Dakota", 0.029, "North Dakota uses low graduated income tax rates."],
  ["OH", "Ohio", 0.035, "Ohio uses graduated state rates; municipal income taxes may also apply."],
  ["OK", "Oklahoma", 0.0475, "Oklahoma uses graduated income tax rates."],
  ["OR", "Oregon", 0.0875, "Oregon uses graduated rates; local taxes may also apply."],
  ["PA", "Pennsylvania", 0.0307, "Pennsylvania uses a flat state income tax rate; local earned income tax may apply."],
  ["RI", "Rhode Island", 0.0475, "Rhode Island uses graduated income tax rates."],
  ["SC", "South Carolina", 0.064, "South Carolina uses graduated income tax rates."],
  ["SD", "South Dakota", 0, "South Dakota has no broad state income tax."],
  ["TN", "Tennessee", 0, "Tennessee has no broad state income tax."],
  ["TX", "Texas", 0, "Texas has no broad state income tax."],
  ["UT", "Utah", 0.0455, "Utah generally uses a flat individual income tax rate."],
  ["VT", "Vermont", 0.066, "Vermont uses graduated income tax rates."],
  ["VA", "Virginia", 0.0575, "Virginia uses graduated income tax rates."],
  ["WA", "Washington", 0, "Washington has no broad state income tax."],
  ["WV", "West Virginia", 0.0512, "West Virginia uses graduated income tax rates."],
  ["WI", "Wisconsin", 0.0627, "Wisconsin uses graduated income tax rates."],
  ["WY", "Wyoming", 0, "Wyoming has no broad state income tax."],
];

export const states: StateInfo[] = rows.map(([code, name, rate, note]) => ({
  code,
  name,
  rate,
  note,
  slug: name.toLowerCase().replace(/ /g, "-"),
}));

export function findState(value: string) {
  return states.find((state) => state.code === value || state.slug === value) ?? states[4];
}
