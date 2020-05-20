/* eslint-disable no-plusplus */
import React from 'react';
import get from 'lodash/get';
import find from 'lodash/find';
import 'styled-components/macro';
import filter from 'lodash/filter';
import { useTitle } from 'react-use';
import findIndex from 'lodash/findIndex';
import { withRouter } from 'react-router-dom';
import { tabs } from 'app/modules/report/mock';
import { CreateReportLayout } from 'app/modules/report/layout';
import { useStoreActions, useStoreState } from 'app/state/store/hooks';
import { AppConfig } from 'app/data';
import { useQuery } from 'app/utils/useQuery';
import { useWindowUnloadEffect } from 'app/utils/useWindowUnloadEffect';
import { DialogBtnType } from 'app/components/surfaces/Dialog/model';
import CheckIcon from '@material-ui/icons/Check';
import { usePersistedState } from 'app/utils/usePersistedState';
import { isNavBtnEnabled } from './utils/isNavBtnEnabled';
import { validateIndVerFields } from './utils/validateIndVerFields';
import { getTabs } from './utils/getTabs';
import { validateOutcomeFields } from './utils/validateOutcomeFields';
import { validateChallengesPlans } from './utils/validateChallengesPlans';
import { validatePolicyPrioritiesFields } from './utils/validatePolicyPriorities';
import { uploadFiles } from './utils/uploadFiles';
import { LocationModel } from './model';
import { getFileTypeAccept } from './utils/getFileTypeAccept';

const getTabIndex = (pathname: string, projectID: string): number =>
  findIndex(tabs, tab => `/report/${projectID}/${tab.path}` === pathname);

function CreateReportFunc(props: any) {
  useTitle(`${AppConfig.appTitleLong} Create report`);
  const query = useQuery();
  // state
  const [project, setProject] = React.useState(undefined);
  const [initialTabIndex, setInitialTabIndex] = React.useState(
    getTabIndex(props.location.pathname, props.match.params.projectID)
  );

  // Outcomes state
  const [title, setTitle] = usePersistedState('report_title', '');
  const [country, setCountry] = usePersistedState('report_country', {
    label: '',
    value: '',
  });
  // @ts-ignore
  const [location, setLocation]: [
    LocationModel | null,
    Function
  ] = usePersistedState('report_location', null);

  // Policy Priorities
  const [tarBenTotal, setTarBenTotal] = usePersistedState(
    'report_tarBenTotal',
    0
  );
  const [tarBenTotal2, setTarBenTotal2] = usePersistedState(
    'report_tarBenTotal2',
    0
  );
  const [beneficiaryCounts, setBeneficiaryCounts] = usePersistedState(
    'report_beneficiaryCounts',
    [
      {
        name: 'Children/Young people',
        value: 0,
      },
      {
        name: 'Elderly',
        value: 0,
      },
      {
        name: 'Women',
        value: 0,
      },
      {
        name: 'Refugees',
        value: 0,
      },
      {
        name: 'Low income individuals',
        value: 0,
      },
    ]
  );
  const [policyPriority, setPolicyPriority] = usePersistedState(
    'report_policyPriority',
    {
      label: '',
      value: '',
    }
  );

  const [budget, setBudget] = usePersistedState('report_budget', 0);
  const [insContribution, setInsContribution] = usePersistedState(
    'report_insContribution',
    0
  );

  // Indicator and verification state
  const [keyOutcomes, setKeyOutcomes] = usePersistedState(
    'report_keyOutcomes',
    ''
  );
  const [monRepOutcomes, setMonRepOutcomes] = usePersistedState(
    'report_monRepOutcomes',
    ''
  );
  const [media, setMedia] = React.useState({
    document: [],
    video: [],
    picture: [],
  });
  const [mediaAdded, setMediaAdded] = usePersistedState(
    'report_mediaAdded',
    []
  );
  const [openMediaModal, setOpenMediaModal] = React.useState(false);

  // Challenges and plans
  const [keyImplChallenges, setKetImplChallenges] = usePersistedState(
    'report_keyImplChallenges',
    ''
  );
  const [otherProjOutObs, setOtherProjOutObs] = usePersistedState(
    'report_otherProjOutObs',
    ''
  );
  const [futurePlans, setFuturePlans] = usePersistedState(
    'report_futurePlans',
    ''
  );
  const [otherComms, setOtherComms] = usePersistedState(
    'report_otherComms',
    ''
  );

  const [dialogProps, setDialogProps] = React.useState({
    title: 'Your report has been sent',
    open: false,
    content: (
      <div
        css={`
          display: flex;
          justify-content: center;
        `}
      >
        <CheckIcon
          htmlColor="#05C985"
          css={`
            font-size: 5rem;
          `}
        />
      </div>
    ),
    buttons: [] as DialogBtnType[],
    onClose: () => setDialogProps(prevState => ({ ...prevState, open: false })),
  });

  const deleteReport = () => {
    const rid = query.get('rid');
    deleteReportAction({
      socketName: 'delReport',
      values: {
        _id: rid,
      },
    });
  };

  const [delDialogProps, setDelDialogProps] = React.useState({
    title: 'Are you sure you want to delete the report?',
    open: false,
    buttons: [
      {
        text: 'Cancel',
        color: '#000000',
        background: '#ffffff',
        action: () => {},
        closeOnClick: true,
      },
      {
        text: 'Delete',
        color: '#ffffff',
        background: '#ed6060',
        action: deleteReport,
        closeOnClick: true,
      },
    ],
    onClose: () =>
      setDelDialogProps(prevState => ({ ...prevState, open: false })),
  });

  const openDelDialog = () => {
    setDelDialogProps(d => ({ ...d, open: true }));
  };

  // redux actions
  const allProjectsAction = useStoreActions(
    actions => actions.allProjects.fetch
  );
  const addReportAction = useStoreActions(actions => actions.addReport.fetch);
  const deleteReportAction = useStoreActions(
    actions => actions.deleteReport.fetch
  );
  const addReportClearAction = useStoreActions(
    actions => actions.addReport.clear
  );
  const deleteReportClearAction = useStoreActions(
    actions => actions.deleteReport.clear
  );
  const snackbarAction = useStoreActions(
    actions => actions.syncVariables.setSnackbar
  );
  const projectBudgetDataAction = useStoreActions(
    actions => actions.projectBudgetData.fetch
  );
  const reportDetailAction = useStoreActions(
    actions => actions.reportDetail.fetch
  );
  const reportDetailClearAction = useStoreActions(
    actions => actions.reportDetail.clear
  );
  // redux data
  const allProjectsData = useStoreState(state =>
    get(state.allProjects.data, 'data', [])
  );
  const addReportData = useStoreState(state => state.addReport.data);
  const addReportLoading = useStoreState(state => state.addReport.loading);
  const deleteReportData = useStoreState(state => state.deleteReport.data);
  const deleteReportLoading = useStoreState(
    state => state.deleteReport.loading
  );
  const projectBudgetData = useStoreState(
    state => state.projectBudgetData.data
  );
  const reportDetailData = useStoreState(state => state.reportDetail.data);

  useWindowUnloadEffect(() => {
    addReportClearAction();
    deleteReportClearAction();
  }, true);

  React.useEffect(() => {
    setInitialTabIndex(
      getTabIndex(props.location.pathname, props.match.params.projectID)
    );
  }, [props.location.pathname, props.match.params.projectID]);

  function setProjectData() {
    setProject(
      find(
        allProjectsData,
        (p: any) => p.project_number === props.match.params.projectID
      )
    );
  }

  React.useEffect(() => {
    if (query.get('rid')) {
      reportDetailAction({
        socketName: 'getReport',
        values: { id: query.get('rid') },
      });
    }
    if (allProjectsData.length === 0) {
      allProjectsAction({
        socketName: 'allProject',
        values: '',
      });
    }
    setProjectData();
    projectBudgetDataAction({
      socketName: 'getProjectBudgetData',
      values: {
        projectID: props.match.params.projectID,
        exludeReportID: query.get('rid'),
      },
    });
    return () => reportDetailClearAction();
  }, []);

  React.useEffect(() => {
    if (get(reportDetailData, 'report', null)) {
      setTitle(get(reportDetailData, 'report.title', ''));
      setCountry({
        label: get(reportDetailData, 'report.country', ''),
        value: get(reportDetailData, 'report.country', ''),
      });
      setLocation(
        get(reportDetailData, 'report.location', null)
          ? {
              longitude: get(reportDetailData, 'report.location.long', 0),
              latitude: get(reportDetailData, 'report.location.lat', 0),
            }
          : null
      );
      setTarBenTotal(
        get(reportDetailData, 'report.total_target_beneficiaries', 0)
      );
      setTarBenTotal2(
        get(reportDetailData, 'report.total_target_beneficiaries_commited', 0)
      );
      setBeneficiaryCounts(
        get(
          reportDetailData,
          'report.target_beneficiaries',
          []
        ).map((b: any) => ({ name: b.name, value: b.value }))
      );
      setPolicyPriority({
        label: get(reportDetailData, 'report.policy_priority.name', ''),
        value: get(reportDetailData, 'report.policy_priority.name', ''),
      });
      if (get(reportDetailData, 'report.media', []).length > 0) {
        setMediaAdded(
          get(reportDetailData, 'report.media', []).map((m: any) => ({
            path: m,
          }))
        );
      }
      setBudget(get(reportDetailData, 'report.budget', 0));
      setInsContribution(get(reportDetailData, 'report.insContribution', 0));
      setKeyOutcomes(get(reportDetailData, 'report.key_outcomes', ''));
      setMonRepOutcomes(
        get(reportDetailData, 'report.monitor_report_outcomes', '')
      );
      setKetImplChallenges(
        get(reportDetailData, 'report.key_implementation_challenges', '')
      );
      setOtherProjOutObs(
        get(reportDetailData, 'report.other_project_outcomes', '')
      );
      setFuturePlans(get(reportDetailData, 'report.plans', ''));
      setOtherComms(get(reportDetailData, 'report.other_comments', ''));
    }
  }, [reportDetailData]);

  React.useEffect(() => {
    setProjectData();
  }, [props.match.params.projectID, allProjectsData]);

  React.useEffect(() => {
    // console.log(addReportData);
    if (get(addReportData, 'status', '') === 'success') {
      const isDraft = get(addReportData, 'data.isDraft', false);
      setDialogProps({
        ...dialogProps,
        open: true,
        title: isDraft
          ? 'Your report has been saved as a draft'
          : query.get('rid')
          ? 'Your report has been saved'
          : 'Your report has been sent',
        buttons: isDraft
          ? [
              {
                text: 'Continue',
                color: '#ffffff',
                background: '#30c2b0',
                action: () => {},
                closeOnClick: true,
              },
            ]
          : [
              {
                text: 'Go to Report',
                color: '#ffffff',
                background: '#30c2b0',
                action: () => {
                  props.history.push(
                    `/reports/${get(addReportData, 'data._id', '')}`
                  );
                },
                closeOnClick: true,
              },
            ],
      });
    }
  }, [addReportData]);

  React.useEffect(() => {
    if (get(deleteReportData, 'status', '') === 'success') {
      props.history.replace('/list/2');
    }
  }, [deleteReportData]);

  React.useEffect(() => {
    if (location && get(location, 'country.label', '') !== '') {
      setCountry(get(location, 'country') as { label: string; value: string });
    }
  }, [location]);

  const onStepChange = (tabIndex: number) => {
    const rid = query.get('rid');
    props.history.push(`${tabs[tabIndex].path}${rid ? `?rid=${rid}` : ''}`);
  };

  const onNextBtnClick = () => {
    const currTabIndex = getTabIndex(
      props.location.pathname,
      props.match.params.projectID
    );
    if (currTabIndex !== tabs.length - 1 && currTabIndex > -1) {
      onStepChange(currTabIndex + 1);
    }
  };

  const onBackBtnClick = () => {
    const currTabIndex = getTabIndex(
      props.location.pathname,
      props.match.params.projectID
    );
    if (currTabIndex !== tabs.length && currTabIndex > 0) {
      onStepChange(currTabIndex - 1);
    }
  };

  const onAddMedia = (
    e: React.ChangeEvent<HTMLInputElement> & { dataTransfer?: DataTransfer },
    type: 'picture' | 'video' | 'document'
  ) => {
    const accept = getFileTypeAccept(type);
    if (media[type]) {
      const newFiles: any = media[type];
      const filesPath = e.dataTransfer ? 'dataTransfer' : 'target';
      for (let i = 0; i < get(e, `${filesPath}.files.length`, 0); i++) {
        const file = get(e, `${filesPath}.files`, [])[i];
        if (accept.indexOf(get(file.type.split('/'), '[0]', '')) !== -1) {
          newFiles.push(file);
        }
      }
      setMedia({ ...media, [type]: newFiles });
    }
  };

  const removeMedia = (name: string) => {
    setMediaAdded((prevData: never[]) => {
      return filter(prevData, (d: any) => {
        return d.path !== name;
      }) as never[];
    });
  };

  const onSaveMediaCB = (data: any) => {
    setMediaAdded((prevData: never[]) => {
      return [...prevData, ...data] as never[];
    });
    setMedia({
      document: [],
      video: [],
      picture: [],
    });
    setOpenMediaModal(false);
    snackbarAction('Files upload completed');
  };

  const onSaveMediaError = (err: any) => {
    snackbarAction('Something went wrong. Please try again');
  };

  const onSaveMedia = () => {
    const files = [...media.picture, ...media.video, ...media.document];
    if (files.length > 0) {
      uploadFiles(files, onSaveMediaCB, onSaveMediaError);
    }
  };

  const onDialogCancel = () => {
    setOpenMediaModal(false);
    setMedia({
      document: [],
      video: [],
      picture: [],
    });
  };

  const draftSubmitEnabled = title.length > 0 || country.label.length > 0;

  const step2Enabled = validateOutcomeFields(title, country.label);

  const step3Enabled =
    step2Enabled &&
    validatePolicyPrioritiesFields(
      tarBenTotal,
      beneficiaryCounts,
      policyPriority.value,
      budget,
      get(projectBudgetData, 'data.remainBudget', 0),
      insContribution
    );

  const step4Enabled =
    step3Enabled && validateIndVerFields(keyOutcomes, monRepOutcomes);

  const step5Enabled =
    step4Enabled &&
    validateChallengesPlans(
      keyImplChallenges,
      otherProjOutObs,
      futurePlans,
      otherComms
    );

  const onSubmit = () => {
    if (step2Enabled && step3Enabled && step4Enabled && step5Enabled) {
      const rid = query.get('rid');
      addReportAction({
        socketName: rid ? 'editReport' : 'addReport',
        values: {
          data: {
            rid,
            title,
            project: props.match.params.projectID,
            target_beneficiaries: beneficiaryCounts,
            policy_priority: policyPriority.value,
            location: location
              ? {
                  long: (location as LocationModel).longitude,
                  lat: (location as LocationModel).latitude,
                }
              : null,
            media: mediaAdded.map((m: any) => m.path),
            country: country.label,
            place_name: location ? (location as LocationModel).place : null,
            total_target_beneficiaries: tarBenTotal,
            total_target_beneficiaries_commited: tarBenTotal2,
            budget,
            insContribution,
            key_outcomes: keyOutcomes,
            monitor_report_outcomes: monRepOutcomes,
            key_implementation_challenges: keyImplChallenges,
            other_project_outcomes: otherProjOutObs,
            plans: futurePlans,
            other_comments: otherComms,
            isDraft: false,
          },
        },
      });
    }
  };

  const onDraftSubmit = () => {
    if (draftSubmitEnabled) {
      const rid = query.get('rid');
      addReportAction({
        socketName: rid ? 'editReport' : 'addReport',
        values: {
          data: {
            rid,
            title: title === '' ? ' ' : title,
            project: props.match.params.projectID,
            target_beneficiaries: beneficiaryCounts,
            policy_priority: policyPriority.value,
            location: location
              ? {
                  long: (location as LocationModel).longitude,
                  lat: (location as LocationModel).latitude,
                }
              : null,
            media: mediaAdded.map((m: any) => m.path),
            country: country.label === '' ? ' ' : country.label,
            place_name: location ? (location as LocationModel).place : null,
            total_target_beneficiaries: tarBenTotal,
            total_target_beneficiaries_commited: tarBenTotal2,
            budget,
            insContribution,
            key_outcomes: keyOutcomes === '' ? ' ' : keyOutcomes,
            monitor_report_outcomes:
              monRepOutcomes === '' ? ' ' : monRepOutcomes,
            key_implementation_challenges:
              keyImplChallenges === '' ? ' ' : keyImplChallenges,
            other_project_outcomes:
              otherProjOutObs === '' ? ' ' : otherProjOutObs,
            plans: futurePlans === '' ? ' ' : futurePlans,
            other_comments: otherComms === '' ? ' ' : otherComms,
            isDraft: true,
          },
        },
      });
    }
  };

  return (
    <CreateReportLayout
      loading={addReportLoading || deleteReportLoading}
      submit={onSubmit}
      saveDraft={onDraftSubmit}
      tabs={getTabs(
        tabs,
        step2Enabled,
        step3Enabled,
        step4Enabled,
        step5Enabled
      )}
      breadcrumbs={{
        currentLocation: 'Report',
        previousLocations: [
          { label: 'Projects', url: '/list/projects' },
          {
            label: get(project, 'project_name', 'Project'),
            url: `/projects/${props.match.params.projectID}`,
          },
        ],
      }}
      changeRoute={onStepChange}
      onNextBtnClick={onNextBtnClick}
      onBackBtnClick={onBackBtnClick}
      initialTabIndex={initialTabIndex}
      outcomesProps={{
        title,
        setTitle,
        country,
        setCountry,
        location,
        setLocation,
      }}
      policyPrioritiesProps={{
        tarBenTotal,
        tarBenTotal2,
        setTarBenTotal,
        setTarBenTotal2,
        policyPriority,
        setPolicyPriority,
        beneficiaryCounts,
        setBeneficiaryCounts,
        budget,
        setBudget,
        remainBudget: get(projectBudgetData, 'data.remainBudget', 0),
        insContribution,
        setInsContribution,
      }}
      indicatorVerificationProps={{
        keyOutcomes,
        setKeyOutcomes,
        monRepOutcomes,
        setMonRepOutcomes,
        media,
        setMedia: onAddMedia,
        mediaAdded,
        onSaveMedia,
        openMediaModal,
        setOpenMediaModal,
        removeMedia,
        onDialogCancel,
      }}
      challengesPlansProps={{
        keyImplChallenges,
        setKetImplChallenges,
        otherProjOutObs,
        setOtherProjOutObs,
        futurePlans,
        setFuturePlans,
        otherComms,
        setOtherComms,
      }}
      nextBtnDisabled={
        !isNavBtnEnabled('next', initialTabIndex, {
          title,
          country,
          tarBenTotal,
          beneficiaryCounts,
          keyOutcomes,
          monRepOutcomes,
          keyImplChallenges,
          otherProjOutObs,
          futurePlans,
          otherComms,
          budget,
          policyPriority,
          remainBudget: get(projectBudgetData, 'data.remainBudget', 0),
          insContribution,
        })
      }
      backBtnDisabled={!isNavBtnEnabled('back', initialTabIndex, {})}
      step2Enabled={step2Enabled}
      step3Enabled={step3Enabled}
      step4Enabled={step4Enabled}
      step5Enabled={step5Enabled}
      showDraftSubmitBtn={draftSubmitEnabled}
      showSubmitBtn={props.location.pathname.split('/')[3] === 'preview'}
      dialogProps={dialogProps}
      delDialogProps={delDialogProps}
      showDeleteBtn={query.get('rid') !== null}
      deleteReport={openDelDialog}
    />
  );
}

export const CreateReport = withRouter(CreateReportFunc);
