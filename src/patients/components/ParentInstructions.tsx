import React from "react";

import { Button, Grid, TextField, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

import { trimName } from "../../helpers/helper";
import InstructionFileMenu from "./InstructionFileMenu";
import { Instructions } from "../types/patient";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";

interface ParentInstructionsProps {
  processing: boolean;
  data: Instructions[] | [];
  setInstructions: (data: Instructions[] | []) => void;
  addPatientInstructions: () => void;
}

const ParentInstructions: React.FC<ParentInstructionsProps> = ({
  processing,
  data,
  setInstructions,
  addPatientInstructions,
}) => {
  const { t } = useTranslation();

  const instructions = data as Instructions[];

  const addInstruction = () => {
    setInstructions([...instructions, { details: "", file: "" }]);
  };

  const removeInstruction = (index: number) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  return (
    <>
      {/* Your existing form JSX here */}

      {/* Instructions section */}
      <Grid container textAlign="center" spacing={2}>
        <Grid item xs={3}>
          <Typography
            marginTop={2}
            marginBottom={2}
            variant="h5"
            textAlign="left"
            gutterBottom
          >
            {t("patientManagement.instructions.label")}
          </Typography>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            size="small"
            sx={{ padding: 1.2 }}
            variant="outlined"
            type="button"
            onClick={addInstruction}
          >
            {t("patientManagement.instructions.actions.add")}
          </Button>
        </Grid>
      </Grid>

      <Grid container textAlign="center" spacing={2}>
        <Grid item xs={12}>
          {instructions &&
            instructions.map((instruction, index) => (
              <Grid container spacing={0.5} key={index}>
                <Grid item xs={7}>
                  <TextField
                    required
                    type="text"
                    size="small"
                    margin="dense"
                    multiline
                    minRows={2}
                    fullWidth
                    label={t(
                      "patientManagement.instructions.object.details.label"
                    )}
                    value={instruction.details}
                    onChange={(e) => {
                      const newInstructions = [...instructions];
                      newInstructions[index].details = e.target.value;
                      setInstructions(newInstructions);
                    }}
                  />
                </Grid>

                <Grid textAlign="center" item xs={3}>
                  <InstructionFileMenu
                    value={instruction.file}
                    initialFileUrl={
                      instruction.file && (instruction.file as string)
                    }
                    onFileUpload={(file: File) => {
                      const newInstructions = [...instructions];
                      newInstructions[index].file = file;
                      setInstructions(newInstructions);
                    }}
                    label={trimName(
                      t("patientManagement.instructions.object.file.label")
                    )}
                  />
                </Grid>

                <Grid item xs={1}>
                  <Button size="small" onClick={() => removeInstruction(index)}>
                    <CloseIcon sx={{ fontSize: 20 }} />
                  </Button>
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid container marginTop={0.2} spacing={2}>
        {/* <Grid item xs={12}>
          
        </Grid> */}
        <Grid item xs={12} textAlign="center">
          {/* Button to trigger a handler in the parent component */}
          {/* <Button
            
            size="small"
            variant="contained"
            type="button"
            processing={processing}
            
          >
            
          </Button> */}

          <LoadingButton
            sx={{ padding: 2 }}
            size="small"
            loading={processing}
            variant="contained"
            onClick={addPatientInstructions}
          >
            {t("patientManagement.instructions.actions.save")}
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  );
};

export default ParentInstructions;
