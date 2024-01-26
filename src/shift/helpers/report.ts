/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShiftReport } from "../types/shiftReport";

export function reportDetails(data: ShiftReport, t: any) {
  if (data) {
    let overall = "";
    const toiletAssistance = data.toilet_assistance;
    const mealAssistance = data.meal_assistance;
    const bathAssistance = data.bath_assistance;
    const groomingAssistance = data.grooming_assistance;
    const positioningAssistance = data.positioning_assistance;
    const medicationMedicalCare = data.medication_medical_care;
    const dailyAssistance = data.daily_assistance;
    const OutgoingAssistanceRecord = data.outgoing_assistance;

    if (toiletAssistance) {
      if (toiletAssistance?.toilet) {
        overall += "トイレ介助, ";
      }
      if (toiletAssistance?.diaper_change) {
        overall += "おむつ交換, ";
      }
      if (toiletAssistance?.linen_change) {
        overall += "リネン類の交換, ";
      }
      if (toiletAssistance?.urinal_flushing) {
        overall += "尿器の洗浄 / ";
      }
    }

    if (mealAssistance) {
      if (mealAssistance?.posture) {
        overall += "姿勢の確保, ";
      }
      if (mealAssistance?.feeding) {
        overall += "食事介助, ";
      }
      if (mealAssistance?.frequency === "alltime") {
        overall += "全部, ";
      } else if (mealAssistance?.frequency === "sometime") {
        overall += "一部 / ";
      }
    }

    if (bathAssistance) {
      if (bathAssistance?.bath) {
        overall += "入浴介助, ";
      }
      if (bathAssistance?.shower) {
        overall += "シャワー介助, ";
      }
      if (bathAssistance?.hair_wash) {
        overall += "洗髪, ";
      }
      if (bathAssistance?.hand_arms_wash) {
        overall += "手洗い・手指消毒, ";
      }
      if (bathAssistance?.feet_wash) {
        overall += "足洗い, ";
      }
      //   if (bathAssistance?.bed_bath) {
      //     overall += "ベッドでの入浴, ";
      //   }
      if (bathAssistance?.bath_type === "whole_body") {
        overall += "全身, ";
      } else if (bathAssistance?.bath_type === "some_part") {
        overall += "部分 / ";
      }
    }

    if (groomingAssistance) {
      if (groomingAssistance?.face_wash) {
        overall += "洗顔, ";
      }
      if (groomingAssistance?.tooth_brush) {
        overall += "歯磨き, ";
      }
      if (groomingAssistance?.hair) {
        overall += "髪のセット, ";
      }
      if (groomingAssistance?.mustache) {
        overall += "髭剃り, ";
      }
      if (groomingAssistance?.nail_cut) {
        overall += "爪切り, ";
      }
      if (groomingAssistance?.ear_cleaning) {
        overall += "耳掃除, ";
      }
      if (groomingAssistance?.nose_cleaning) {
        overall += "鼻掃除, ";
      }
      if (groomingAssistance?.dressing) {
        overall += "着替え, ";
      }
      if (groomingAssistance?.make_up) {
        overall += "化粧 / ";
      }
    }

    if (positioningAssistance) {
      if (positioningAssistance?.body) {
        overall += "体位変換, ";
      }
      if (positioningAssistance?.transfer) {
        overall += "移乗, ";
      }
      if (positioningAssistance?.going_out) {
        overall += "外出, ";
      }
      if (positioningAssistance?.ready_going_out) {
        overall += "外出準備, ";
      }
      if (positioningAssistance?.going_back) {
        overall += "帰宅, ";
      }
      if (positioningAssistance?.hospital) {
        overall += "病院, ";
      }
      if (positioningAssistance?.shopping) {
        overall += "買い物, ";
      }
      if (positioningAssistance?.getting_up) {
        overall += "起床, ";
      }
      if (positioningAssistance?.sleeping) {
        overall += "就寝 / ";
      }
    }

    if (medicationMedicalCare) {
      if (medicationMedicalCare?.medication_assistance) {
        overall += "服薬介助, ";
      }
      if (medicationMedicalCare?.medication_application) {
        overall += "塗薬, ";
      }
      if (medicationMedicalCare?.eye_drops) {
        overall += "点眼, ";
      }
      if (medicationMedicalCare?.phlegm_suction) {
        overall += "痰の吸引, ";
      }
      if (medicationMedicalCare?.enema) {
        overall += "浣腸, ";
      }
      if (medicationMedicalCare?.tube_feeding) {
        overall += "経管栄養, ";
      }
      if (medicationMedicalCare?.watch) {
        overall += "観察 / ";
      }
    }

    if (dailyAssistance) {
      if (dailyAssistance?.cleaning) {
        overall += "掃除, ";
      }
      if (dailyAssistance?.garbase_disposal) {
        overall += "ゴミ出し, ";
      }
      if (dailyAssistance?.laundry) {
        overall += "洗濯, ";
      }
      if (dailyAssistance?.cooking) {
        overall += "調理 / ";
      }
    }

    if (OutgoingAssistanceRecord) {
      // map the records and one by one add to the overall string
      OutgoingAssistanceRecord.map((record) => {
        overall += `${transport_types(record.transport_type, t)} - ${
          record.destination
        } - ${record.support_hours}時間 /`;
      });
    }

    return overall;
  }

  return "";
}

export type TransportType = "walk" | "bus" | "train" | "car_taxi" | "other";

function transport_types(transport_type: string, t: any) {
  switch (transport_type) {
    case "car_taxi":
      return t("shiftReport.dialog.form.transport_type.options.car_taxi");
    case "walk":
      return t("shiftReport.dialog.form.transport_type.options.walk");
    case "bus":
      return t("shiftReport.dialog.form.transport_type.options.bus");
    case "train":
      return t("shiftReport.dialog.form.transport_type.options.train");
    case "other":
      return t("shiftReport.dialog.form.transport_type.options.other");

    default:
      return "";
  }
}
