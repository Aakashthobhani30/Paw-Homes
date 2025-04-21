import ModifyEvent from "../../components/ModifyEvent";

function AddEvent() {
  return <ModifyEvent route="/api/events/" method="add" />;
}

export default AddEvent;
