import React from 'react';
import {
  Grid,
  Typography,
  CardHeader,
  Card,
  CardContent,
  Box,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PolicyPrioritiesPropsModel } from 'app/modules/report/model';
import { policyPriorities } from 'app/modules/report/sub-modules/policy-priorities/mock';
import { Autocomplete } from 'app/modules/report/sub-modules/outcomes/common/Autocomplete';
import { IntentTexFieldSingleLine } from 'app/modules/report/sub-modules/indicator-verification/common/IntentTextFieldSingleLine';
import { styles } from 'app/modules/report/sub-modules/policy-priorities/styles';

export const PolicyPrioritiesLayout = (props: PolicyPrioritiesPropsModel) => {
  const { t } = useTranslation();
  const [isBlur, setIsBlur] = React.useState(false);

  React.useEffect(() => {
    setIsBlur(
      props.policyPriority.value === '' ||
        props.budget === 0 ||
        props.insContribution === 0
    );
  }, [props.policyPriority, props.budget, props.insContribution]);

  return (
    <React.Fragment>
      {/* ---------------------------------------------------------------------*/}
      {/* Policy Priorities */}
      <Grid data-cy="policy-priority" item xs={12} md={12} lg={4}>
        <Card css={styles.card}>
          <CardHeader
            title={t('reports.form.textfield.insinger_f_policy_priorities')}
          />
          <CardContent>
            <Autocomplete
              values={policyPriorities.map((pp: any) => ({
                ...pp,
                label: t(pp.label),
              }))}
              value={props.policyPriority}
              setValue={props.setPolicyPriority}
            />
            <Box height="14px" width="100%" />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t('reports.form.textfield.sdg_mapping_expl')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ---------------------------------------------------------------------*/}
      {/* Budget */}
      <Grid data-cy="budget-container" item xs={12} md={6} lg={4}>
        <Card css={styles.card}>
          <CardHeader title={t('reports.form.textfield.budget')} />
          <CardContent>
            <IntentTexFieldSingleLine
              testAttr="budget-field"
              fullWidth
              type="number"
              min={0}
              value={props.budget}
              setValue={props.setBudget}
              description=""
            />
            <Box height="14px" width="100%" />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t('reports.form.textfield.remaining')}: {props.remainBudget}€
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ---------------------------------------------------------------------*/}
      {/* Insinger contribution */}
      <Grid data-cy="insinger-contribution" item xs={12} md={6} lg={4}>
        <Card css={styles.card}>
          <CardHeader title={t('reports.form.textfield.contribution')} />
          <CardContent>
            <IntentTexFieldSingleLine
              testAttr="insinger-contribution-field"
              fullWidth
              type="number"
              min={0}
              value={props.insContribution}
              setValue={props.setInsContribution}
              description=""
            />

            <Box height="14px" width="100%" />
          </CardContent>
        </Card>
      </Grid>

      {/* --------------------------------------------------------------------- */}
      {/* Target beneficiaries */}

      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={4}
        css={isBlur ? styles.blurBlock : ``}
      >
        <Card css={styles.card}>
          <CardHeader
            title={t('reports.form.textfield.target_beneficiaries')}
          />
          <CardContent>
            <IntentTexFieldSingleLine
              testAttr="target-beneficiaries-field"
              fullWidth
              type="number"
              min={0}
              value={props.tarBenTotal}
              description=""
              setValue={props.setTarBenTotal}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={4}
        css={isBlur ? styles.blurBlock : ``}
      >
        <Card css={styles.card}>
          <CardHeader title={t('reports.form.textfield.total_commited')} />
          <CardContent css={styles.cardContent}>
            <IntentTexFieldSingleLine
              testAttr="total-committed-field"
              fullWidth
              type="number"
              min={0}
              value={props.tarBenTotal2}
              description=""
              setValue={props.setTarBenTotal2}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* /!* ---------------------------------------------------------------------*!/ */}
      {/* /!* Of which the beneficiaries will likely include approximately *!/ */}
      <Grid
        item
        container
        sm={12}
        md={12}
        lg={8}
        css={isBlur ? styles.blurBlock : ``}
        spacing={0}
      >
        <Card css={styles.card}>
          <CardHeader title={t('reports.form.textfield.of_which_ben')} />
          <CardContent>
            <Grid item container lg={12} spacing={4}>
              {props.beneficiaryCounts.map((item: any, index: number) => (
                <Grid item xs={12} md={6} lg={4} key={item.name}>
                  <IntentTexFieldSingleLine
                    testAttr={`which-when-item-${index}`}
                    type="number"
                    min={0}
                    value={item.value}
                    description={item.name}
                    setValue={(v: number) => {
                      const values = [...props.beneficiaryCounts];
                      values[index].value = v;
                      props.setBeneficiaryCounts(values);
                    }}
                    smallWidth
                  />
                </Grid>
              ))}
            </Grid>

            <div
              css={`
                width: 100%;
                height: 24px;
              `}
            />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t('reports.form.textfield.sdg_mapping_expl')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>
  );
};
