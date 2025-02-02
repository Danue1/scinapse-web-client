import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FormikErrors } from 'formik';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { AppState } from '../../reducers';
import { closeCreateKeywordAlertDialog } from '../../reducers/createKeywordAlertDialog';
import {
  startToConnectKeywordSettingsAPI,
  succeedToConnectKeywordSettingsAPI,
  failedToConnectKeywordSettingsAPI,
} from '../../reducers/keywordSettings';
import MemberAPI from '../../api/member';
import { ACTION_TYPES } from '../../actions/actionTypes';
import ScinapseFormikInput from '../common/scinapseInput/scinapseFormikInput';
import Button from '../common/button';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
import { openSnackbar, GLOBAL_SNACKBAR_TYPE } from '../../reducers/scinapseSnackbar';
import PlutoAxios from '../../api/pluto';
import Icon from '../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./createKeywordAlertDialog.scss');

type FormState = ReturnType<typeof getInitialValues>;

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};

  if (!values.keyword) {
    errors.keyword = 'Please enter keyword';
  }

  return errors;
}

function getInitialValues(keyword: string) {
  return {
    keyword,
  };
}

const CreateKeywordAlertDialog: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const { isOpen, openFrom, keyword, isLoading } = useSelector((appState: AppState) => ({
    isOpen: appState.createKeywordAlertDialogState.isOpen,
    openFrom: appState.createKeywordAlertDialogState.from,
    keyword: appState.createKeywordAlertDialogState.keyword,
    isLoading: appState.keywordSettingsState.isLoading,
  }));
  const actionArea = openFrom;

  function handleClose() {
    dispatch(closeCreateKeywordAlertDialog());
  }

  async function handleSubmitForm(values: FormState) {
    dispatch(startToConnectKeywordSettingsAPI());

    try {
      const keywordRes = await MemberAPI.newKeywordSettings(values.keyword);
      dispatch(succeedToConnectKeywordSettingsAPI({ keywords: keywordRes.data.content }));
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: 'fire',
        actionArea: actionArea,
        actionTag: 'createKeywordAlert',
        actionLabel: values.keyword,
      });
      dispatch(
        openSnackbar({
          type: GLOBAL_SNACKBAR_TYPE.CREATE_KEYWORD_ALERT,
          id: null,
          context: null,
          actionTicketParams: {
            pageType: getCurrentPageType(),
            actionType: 'view',
            actionArea: 'createKeywordSnackbar',
            actionTag: 'viewCreateKeywordSnackbar',
            actionLabel: values.keyword,
          },
        })
      );
    } catch (err) {
      dispatch(failedToConnectKeywordSettingsAPI());
      const error = PlutoAxios.getGlobalError(err);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: error.message,
        },
      });
    }

    handleClose();
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.title}>Create keyword alert</div>
      <div className={s.description}>We’ll send email updated papers for the registered keyword.</div>
      <Formik
        initialValues={getInitialValues(keyword)}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        render={({ errors }) => (
          <Form className={s.form}>
            <div className={s.inputWrapper}>
              <label htmlFor="keyword" className={s.detailLabel}>
                KEYWORD
              </label>
              <Field
                name="keyword"
                type="keyword"
                className={classNames({
                  [s.keywordInput]: true,
                  [s.keywordInputError]: !!errors.keyword,
                })}
                placeholder="ex) Nanotechnology"
                icon={!!errors.keyword ? 'ERROR' : null}
                iconclassname={s.errorIcon}
                component={ScinapseFormikInput}
              />
            </div>
            <div className={s.btnWrapper}>
              <Button
                elementType="button"
                size="medium"
                variant="contained"
                color="blue"
                type="submit"
                isLoading={isLoading}
              >
                <span>Create</span>
              </Button>
            </div>
          </Form>
        )}
      />
      <div className={s.closeBtnWrapper}>
        <Button
          elementType="button"
          size="small"
          variant="text"
          color="gray"
          fullWidth={false}
          disabled={false}
          onClick={handleClose}
        >
          <Icon icon="X_BUTTON" />
        </Button>
      </div>
    </Dialog>
  );
};

export default CreateKeywordAlertDialog;
