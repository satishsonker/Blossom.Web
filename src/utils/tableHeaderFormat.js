import ShowThumb from "../components/images/ShowThumb";
import { common } from "./common";
import React from "react";
const headerFormat = {
  userList: [
    {
      name: "Profile Image", prop: "profilePicturePath",
      action: {
        footerText: "Total",
        showTooltip: false
      },
      customColumn: (data, header) => {
        return <>
          <ShowThumb src={common.getFileUrl(data?.profilePicturePath)} alt="Profile" width={50} height={50} style={{ objectFit: 'cover', borderRadius: '8px' }} />
        </>
      }
    },
    {
      name: "Username", prop: "username",
      action: { footerText: "Total", showTooltip: false }
    },
    {
      name: "Email", prop: "email",
      action: {
        footerText: "", hAlign: "center"
      }
    },
    {
      name: "IsEmailVerified", prop: "isEmailVerified",
      customColumn: (data, header) => {
        return data?.isEmailVerified ? "Yes" : "No";
      },
      action: { footerSum: true, footerSumInDecimal: false }
    },
    {
      name: "IsTCAccepted", prop: "isTCAccepted",
      customColumn: (data, header) => {
        return data?.isEmailVerified ? "Yes" : "No";
      },
      action: { upperCase: true, footerText: "", dAlign: "start" }
    },
    {
      name: "IsActive", prop: "isActive",
      customColumn: (data, header) => {
        return data?.isEmailVerified ? "Yes" : "No";
      },
      action: { footerText: "", dAlign: "start" }
    }
  ],
}

export { headerFormat };