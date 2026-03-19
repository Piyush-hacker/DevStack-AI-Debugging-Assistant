export const demoHistoryEntries = [
  {
    id: "demo-react-map-keys",
    language: "React",
    errorMessage:
      "Warning: Each child in a list should have a unique \"key\" prop.",
    code: `const users = [{ name: "Ava" }, { name: "Noah" }];

export default function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li>{user.name}</li>
      ))}
    </ul>
  );
}`,
    analysis: {
      explanation:
        "React is warning because list items rendered with map need a stable key so React can track which item changed between renders.",
      causes: [
        "The array items are rendered without a key prop.",
        "React cannot reliably identify which list element belongs to which data item."
      ],
      fix: "Add a stable key prop to each rendered list item. Use a unique id from the data when possible.",
      improvedCode: `const users = [
  { id: "ava", name: "Ava" },
  { id: "noah", name: "Noah" }
];

export default function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
      debugSteps: [
        "Find the component that renders the list with map.",
        "Check whether each rendered child receives a stable key prop.",
        "Prefer a real id from the data over the array index."
      ]
    },
    createdAt: "2026-03-18T10:15:00.000Z",
    updatedAt: "2026-03-18T10:15:00.000Z",
    isDemo: true
  },
  {
    id: "demo-node-undefined-length",
    language: "JavaScript",
    errorMessage: "TypeError: Cannot read properties of undefined (reading 'length')",
    code: `function printTotal(items) {
  console.log(items.length);
}

printTotal();`,
    analysis: {
      explanation:
        "The function expects an array-like value, but it is being called without an argument, so items is undefined when length is accessed.",
      causes: [
        "The function is called with missing input.",
        "There is no guard clause before reading items.length."
      ],
      fix: "Provide a default value or validate the argument before using it.",
      improvedCode: `function printTotal(items = []) {
  console.log(items.length);
}

printTotal();

function printTotalSafe(items) {
  if (!Array.isArray(items)) {
    console.log("Expected an array of items.");
    return;
  }

  console.log(items.length);
}`,
      debugSteps: [
        "Reproduce the issue and inspect the value passed into the function.",
        "Add a guard clause or default parameter for missing input.",
        "Retest with both valid input and no input."
      ]
    },
    createdAt: "2026-03-17T16:40:00.000Z",
    updatedAt: "2026-03-17T16:40:00.000Z",
    isDemo: true
  }
];

export const demoAnalyzeResponse = {
  explanation:
    "This sample analysis is shown because the live backend is not available yet. The issue likely comes from an undefined value being used before it is validated.",
  causes: [
    "A function is being called without the expected input.",
    "The code accesses a property before checking whether the value exists."
  ],
  fix: "Add a guard clause or a default value before using the variable, then retest with the same failing case.",
  improvedCode: `function printTotal(items = []) {
  if (!Array.isArray(items)) {
    console.log("Expected an array of items.");
    return;
  }

  console.log(items.length);
}

printTotal();`,
  debugSteps: [
    "Reproduce the issue with the smallest code sample possible.",
    "Log the variable that causes the crash and confirm its runtime value.",
    "Add a guard or default value, then rerun the same failing input."
  ]
};
