import React from "react";
import { Grid, Checkbox, Typography } from "@mui/material";

interface FormValues {
  onsite_exercises_training: number[];
}

interface OnSiteExerciseTrainingChecklistProps {
  checkedItems: number[];
  handleCheckboxChange: (number: number) => void;
}

const OnSiteExerciseTrainingChecklist: React.FC<
  OnSiteExerciseTrainingChecklistProps
> = ({ checkedItems, handleCheckboxChange }) => {
  const rows = [
    {
      label: "原本",
      description: "実地研修受講申込書（個人用）（様式1）",
      content: "実地研修受講者からの研修実施内容の確認",
      number: 1,
    },
    {
      label: "復写",
      description: "実地研修準備チェック表（様式2）",
      content: "この用紙",
      number: 2,
    },
    {
      label: "復写",
      description: "利用者または家族の同意書（様式3）",
      content: "実地研修の実施に対する利用者の同意",
      number: 3,
    },
    {
      label: "復写",
      description: "主治医の書面による指示書（様式4）",
      content: "主治医から指導講師（看護師等）に対する指示",
      number: 4,
    },
    {
      label: "復写",
      description: "実地研修指導講師承諾書（様式5）",
      content: "実地研修指導に対する指導講師（看護師等）の承諾",
      number: 5,
    },
    {
      label: "原本",
      description: "実地研修実施機関承諾書（様式6）",
      content: "実地研修の実施に対する介護事業所の承諾",
      number: 6,
    },
  ];

  return (
    <>
      <Typography variant="h6" sx={{ marginTop: "8px" }}>
        {"【現場演習及び実地研修に関して、提出していただく書類】"}
      </Typography>
      <Grid
        marginTop={1}
        container
        spacing={0}
        sx={{ border: "0.5px solid grey", borderRadius: "5px" }}
      >
        <Grid
          item
          xs={1.5}
          sx={{
            border: "0.5px solid grey",
            padding: "3px",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <Typography fontWeight={"bold"}>確認欄</Typography>
        </Grid>
        <Grid
          item
          xs={4.5}
          sx={{
            border: "0.5px solid grey",
            padding: "3px",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <Typography fontWeight={"bold"}>依頼及び提出が必要なもの</Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            border: "0.5px solid grey",
            padding: "3px",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <Typography fontWeight={"bold"}>内容</Typography>
        </Grid>

        {rows.map((row) => (
          <React.Fragment key={row.number}>
            <Grid
              item
              xs={1.5}
              sx={{ border: "0.5px solid grey", padding: "3px" }}
              onClick={() => handleCheckboxChange(row.number)}
            >
              <Checkbox
                color="success"
                checked={checkedItems.includes(row.number)}
                // onChange={() => handleCheckboxChange(row.number)}
              />
              {row.label}
            </Grid>
            <Grid
              item
              xs={4.5}
              sx={{
                border: "0.5px solid grey",
                padding: "3px",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <Typography>{row.description}</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                border: "0.5px solid grey",
                padding: "3px",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <Typography>{row.content}</Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
};

export default OnSiteExerciseTrainingChecklist;
