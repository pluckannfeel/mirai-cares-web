import React from "react";
import { Grid, Checkbox, Typography } from "@mui/material";

interface BusinessSystemEstablishedChecklistProps {
  checkedItems: number[];
  handleCheckboxChange: (number: number) => void;
}

const BusinessSystemEstablishedChecklist: React.FC<
  BusinessSystemEstablishedChecklistProps
> = ({ checkedItems, handleCheckboxChange }) => {
  const rows = [
    {
      description: "実地研修（当該研修）に対応した損害賠償保険に加入している",
      number: 1,
    },
    {
      description: "当該研修の指示書、助言の記録等の管理、保管をしている",
      number: 2,
    },
    {
      description: "当該利用者に関する技術手順、マニュアル等を整備している",
      number: 3,
    },
    {
      description:
        "利用者の個人情報の秘密保持に関わる措置を講じている（書面にて、誓約を交わしている）",
      number: 4,
    },
    {
      description: "ヒヤリハット事例の蓄積、分析、評価、検証を行う体制がある",
      number: 5,
    },
    {
      description:
        "緊急時の対応手順・体制が定められ、緊急時の連絡体制が確立している",
      number: 6,
    },
    {
      description:
        "訪問看護事業等他機関との連携により、安全確保のための体制を整備している（施設の場合）安全確保のための「安全対策委員会」を設置している",
      number: 7,
    },
    {
      description:
        "かかりつけ医等及び指導看護師等の指導のもと、連携・相談・報告等の連絡が図れる体制がある",
      number: 8,
    },
    {
      description: "地域との連携体制が整備されている",
      number: 9,
    },
  ];

  return (
    <>
      <Typography variant="h6" sx={{ marginTop: "8px" }}>
        {"【事業システム確立に関して、確認事項】"}
      </Typography>
      <Grid
        marginTop={1}
        container
        spacing={0}
        sx={{ border: "0.5px solid grey", borderRadius: "5px" }}
      >
        <Grid
          item
          xs={1}
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
          xs={11}
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
              xs={1}
              sx={{ border: "0.5px solid grey", padding: "3px" }}
              onClick={() => handleCheckboxChange(row.number)}
            >
              <Checkbox
                color="info"
                checked={checkedItems.includes(row.number)}
              />
            </Grid>
            <Grid
              item
              xs={11}
              sx={{
                border: "0.5px solid grey",
                padding: "3px",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <Typography>{row.description}</Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
};

export default BusinessSystemEstablishedChecklist;
