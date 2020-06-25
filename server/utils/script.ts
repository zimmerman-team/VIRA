import get from 'lodash/get';

export function modifyOrganisation(OrgObj: any, newData: any) {
  return new Promise((resolve, reject) => {
    if (OrgObj.org_type !== get(newData.orgType, '_id', null)) {
      OrgObj.org_type = newData.orgType;
    }
    if (OrgObj.street !== newData.street) {
      OrgObj.street = newData.street;
    }
    if (OrgObj.house_number !== newData.house_number) {
      OrgObj.house_number = newData.house_number;
    }
    if (OrgObj.additional_house_number !== newData.additional_house_number) {
      OrgObj.additional_house_number = newData.additional_house_number;
    }
    if (OrgObj.postcode !== newData.postcode) {
      OrgObj.postcode = newData.postcode;
    }
    if (OrgObj.place !== newData.place) {
      OrgObj.place = newData.place;
    }
    if (OrgObj.country !== newData.country) {
      OrgObj.country = newData.country;
    }
    if (OrgObj.website !== newData.website) {
      OrgObj.website = newData.website;
    }
    if (OrgObj.place !== newData.place) {
      OrgObj.place = newData.place;
    }
    OrgObj.save((err: any, doc: any) => {
      resolve();
    });
  });
}

export function modifyResponsiblePerson(PerObj: any, newData: any) {
  return new Promise((resolve, reject) => {
    if (PerObj.family_name !== newData.family_name) {
      PerObj.family_name = newData.family_name;
    }
    if (PerObj.initials !== newData.initial) {
      PerObj.initials = newData.initial;
    }
    if (PerObj.name_insertion !== newData.insertion) {
      PerObj.name_insertion = newData.insertion;
    }
    if (PerObj.title !== newData.title) {
      PerObj.title = newData.title;
    }
    if (PerObj.email !== newData.email) {
      PerObj.email = newData.email;
    }
    if (PerObj.login_email !== newData.login_email) {
      PerObj.login_email = newData.login_email;
    }
    if (PerObj.sex !== newData.sex) {
      PerObj.sex = newData.sex;
    }
    if (PerObj.role !== newData.role) {
      PerObj.role = newData.role;
    }
    if (
      PerObj.organisation !==
      get(newData.Organisation, '_id', PerObj.organisation)
    ) {
      PerObj.organisation = newData.Organisation;
    }
    PerObj.save((err: any, doc: any) => {
      resolve();
    });
  });
}

export function modifyProject(ProjObj: any, newData: any) {
  return new Promise((resolve, reject) => {
    if (ProjObj.project_name !== newData.project) {
      ProjObj.project_name = newData.project;
    }
    if (ProjObj.project_description !== newData.project_description) {
      ProjObj.project_description = newData.project_description;
    }
    if (ProjObj.duration !== newData.duration) {
      ProjObj.duration = newData.duration;
    }
    if (ProjObj.start_date !== newData.start_date) {
      ProjObj.start_date = newData.start_date;
    }
    if (ProjObj.end_date !== newData.end_date) {
      ProjObj.end_date = newData.end_date;
    }
    if (ProjObj.total_amount !== newData.total_amount) {
      ProjObj.total_amount = newData.total_amount;
    }
    if (ProjObj.decision_date !== newData.decision_date) {
      ProjObj.decision_date = newData.decision_date;
    }
    if (ProjObj.decision !== newData.decision) {
      ProjObj.decision = newData.decision;
    }
    if (ProjObj.released_amount !== newData.released_amount) {
      ProjObj.released_amount = newData.released_amount;
    }
    if (ProjObj.allocated_amount !== newData.allocated_amount) {
      ProjObj.allocated_amount = newData.allocated_amount;
    }
    if (ProjObj.paid_amount !== newData.paid_amount) {
      ProjObj.paid_amount = newData.paid_amount;
    }
    if (ProjObj.organisation !== get(newData.Organisation, '_id', null)) {
      ProjObj.organisation = newData.Organisation;
    }
    if (ProjObj.category !== get(newData.Category, '_id', null)) {
      ProjObj.category = newData.Category;
    }

    ProjObj.save((err: any, doc: any) => {
      resolve();
    });
  });
}
