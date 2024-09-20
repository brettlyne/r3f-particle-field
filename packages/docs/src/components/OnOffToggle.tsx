import IconButton from "@mui/material/IconButton";

interface OnOffToggleProps {
  onChange: (value: boolean) => void;
  value: boolean;
}

const OnOffToggle: React.FC<OnOffToggleProps> = ({ onChange, value }) => {
  return (
    <>
      <IconButton
        className={`text-tile ${value ? "active" : ""}`}
        sx={{ padding: 0 }}
        onClick={() => onChange(true)}
      >
        on
      </IconButton>
      <IconButton
        className={`text-tile ${value ? "" : "active"}`}
        sx={{ padding: 0 }}
        onClick={() => onChange(false)}
      >
        off
      </IconButton>
    </>
  );
};

export default OnOffToggle;
