import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
const postmark = require('postmark');
import * as PostmarkTypes from 'postmark';

dotenv.config();

const client: PostmarkTypes.ServerClient = new postmark.ServerClient(
  process.env.REACT_APP_POSTMARK_CLIENT_ID as string
);

export function sendMail(
  data: any,
  templateId: number,
  parentResolve: Function
) {
  client
    .sendEmailWithTemplate({
      TemplateId: templateId,
      From: 'insinger@zimmermanzimmerman.nl',
      To: data.email,
      TemplateModel: { app: 'M&E Insinger', ...data },
      Attachments: [
        {
          Content: fs
            .readFileSync(
              path.resolve(__dirname, '../assets/images/insinger_logo.png')
            )
            .toString('base64'),
          Name: 'insinger_logo.png',
          ContentType: 'image/png',
          ContentID: 'cid:insinger_logo.png',
        },
      ],
    })
    .then((response: any) => {
      if (parentResolve) {
        parentResolve(response);
      }
      return response;
    })
    .catch((error: any) => {
      return error;
    });
}

export function sendForgotPassMail(email: string, link: string) {
  return client.sendEmailWithTemplate({
    TemplateId: 15847923,
    From: 'insinger@zimmermanzimmerman.nl',
    To: email,
    TemplateModel: { app: 'M&E Insinger', link },
    Attachments: [
      {
        Content: fs
          .readFileSync(
            path.resolve(__dirname, '../assets/images/insinger_logo.png')
          )
          .toString('base64'),
        Name: 'insinger_logo.png',
        ContentType: 'image/png',
        ContentID: 'cid:insinger_logo.png',
      },
    ],
  });
}
