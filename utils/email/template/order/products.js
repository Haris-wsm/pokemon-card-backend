exports.getProcductTable = (products) => {
  return products
    .map((data) => {
      const { image, name, price, qty } = data.product;
      const imgURL = process.env.DOMIAN_BAKEND + image;

      const tempalte = `
        <tr>
          <td class="esdev-adapt-off" align="left" style="padding: 20px; margin: 0">
            <table
              cellpadding="0"
              cellspacing="0"
              class="esdev-mso-table"
              style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
              width: 560px;
            "
            >
              <tr>
                <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    class="es-left"
                    align="left"
                    style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: left;
                  "
                  >
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 125px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                        >
                          <tr>
                            <td
                              align="center"
                              style="
                              padding: 0;
                              margin: 0;
                              font-size: 0px;
                            "
                            >
                              <img
                                class="adapt-img p_image"
                                src="${imgURL}"
                                alt="Sony WH-1000XM4"
                                style="
                                  display: block;
                                  border: 0;
                                  outline: none;
                                  text-decoration: none;
                                  -ms-interpolation-mode: bicubic;
                                "
                                width="125"
                                title="Sony WH-1000XM4"
                                height="125"
                              />
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding: 0; margin: 0; width: 20px"></td>
                <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    class="es-left"
                    align="left"
                    style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: left;
                  "
                  >
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 125px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                        >
                          <tr>
                            <td
                              align="left"
                              class="es-m-p0t es-m-p0b es-m-txt-l"
                              style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-bottom: 20px;
                            "
                            >
                              <h3
                                style="
                                margin: 0;
                                line-height: 19px;
                                mso-line-height-rule: exactly;
                                font-family: arial,
                                  'helvetica neue', helvetica,
                                  sans-serif;
                                font-size: 16px;
                                font-style: normal;
                                font-weight: bold;
                                color: #333333;
                              "
                              >
                                <strong class="p_name">${name}</strong>
                              </h3>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding: 0; margin: 0; width: 20px"></td>
                <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    class="es-left"
                    align="left"
                    style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: left;
                  "
                  >
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 176px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                        >
                          <tr>
                            <td
                              align="right"
                              class="es-m-p0t es-m-p0b"
                              style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-bottom: 20px;
                            "
                            >
                              <p
                                style="
                                margin: 0;
                                -webkit-text-size-adjust: none;
                                -ms-text-size-adjust: none;
                                mso-line-height-rule: exactly;
                                font-family: arial,
                                  'helvetica neue', helvetica,
                                  sans-serif;
                                line-height: 21px;
                                color: #666666;
                                font-size: 14px;
                              "
                                class="p_description"
                              >
                                x${qty}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding: 0; margin: 0; width: 20px"></td>
                <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    class="es-right"
                    align="right"
                    style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: right;
                  "
                  >
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 74px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                        "
                        >
                          <tr>
                            <td
                              align="right"
                              class="es-m-p0t es-m-p0b"
                              style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-bottom: 20px;
                            "
                            >
                              <p
                                class="p_price"
                                style="
                                margin: 0;
                                -webkit-text-size-adjust: none;
                                -ms-text-size-adjust: none;
                                mso-line-height-rule: exactly;
                                font-family: arial,
                                  'helvetica neue', helvetica,
                                  sans-serif;
                                line-height: 21px;
                                color: #666666;
                                font-size: 14px;
                              "
                              >
                              ฿${price}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        `;

      return tempalte;
    })
    .join("");
};
