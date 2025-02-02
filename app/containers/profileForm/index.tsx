import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Field, Form, Formik } from 'formik';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../../components/dialog/components/modifyProfile/affiliationSelectBox';
import { withStyles } from '../../helpers/withStylesHelper';
import { AppState } from '../../reducers';
import { updateUserProfile } from '../../actions/auth';
import { ACTION_TYPES, AlertAction, AuthActions } from '../../actions/actionTypes';

const s = require('./profileForm.scss');

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  affiliation: Affiliation | SuggestAffiliation;
  profileLink: string;
}

type ProfileFormErrors = { [K in keyof ProfileFormValues]: string };

function isSuggestedAffiliation(affiliation: Affiliation | SuggestAffiliation): affiliation is SuggestAffiliation {
  return !!(affiliation as SuggestAffiliation).keyword;
}

const validateForm = (values: ProfileFormValues) => {
  const errors: Partial<ProfileFormErrors> = {};

  if (!values.firstName) {
    errors.firstName = 'Please enter your first name';
  }

  if (!values.lastName) {
    errors.lastName = 'Please enter your last name';
  }

  if (
    !values.affiliation ||
    (!(values.affiliation as Affiliation).name && !(values.affiliation as SuggestAffiliation).keyword)
  ) {
    errors.affiliation = 'Please enter your affiliation';
  }

  if (values.profileLink && values.profileLink.match(/(http(s)?:\/\/.)/g) === null) {
    errors.profileLink = 'Please write start to http:// or https://';
  }

  return errors;
};

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

const ErrorMessage: React.FC<{ errorMsg?: string }> = ({ errorMsg }) => {
  if (!errorMsg) return null;

  return <div className={s.errorMsg}>{errorMsg}</div>;
};

interface ProfileFormContainerProps {
  dispatch: ThunkDispatch<{}, {}, AuthActions | AlertAction>;
}
const ProfileFormContainer: React.FC<ProfileFormContainerProps & ReturnType<typeof mapStateToProps>> = ({
  currentUser,
  dispatch,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  if (!currentUser.isLoggedIn) return null;

  async function handleSubmit(values: ProfileFormValues) {
    let affiliation = values.affiliation;
    if (isSuggestedAffiliation(affiliation)) {
      affiliation = { id: affiliation.affiliationId, name: affiliation.keyword, nameAbbrev: '' };
    }

    try {
      setIsLoading(true);
      await dispatch(
        updateUserProfile({
          firstName: values.firstName,
          lastName: values.lastName,
          affiliation: affiliation,
          profileLink: values.profileLink,
        })
      );
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Successfully changed your profile.',
        },
      });
      setIsLoading(false);
      setEditMode(false);
    } catch (err) {
      setIsLoading(false);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'Sorry. we had an error to update your profile.',
        },
      });
    }
  }

  return (
    <div>
      <div className={s.divider} />
      <h1 className={s.title}>Profile</h1>
      <Formik
        initialValues={{
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          affiliation: {
            id: null,
            name: currentUser.affiliation,
            nameAbbrev: null,
          },
          profileLink: currentUser.profileLink,
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
        validateOnChange={false}
        render={({ errors, touched }) => {
          let formButton = (
            <div
              className={s.editButton}
              onClick={() => {
                setEditMode(true);
              }}
            >
              Edit Profile
            </div>
          );
          if (editMode) {
            formButton = (
              <>
                <button
                  type="submit"
                  className={classNames({
                    [s.submitButton]: true,
                    [s.isLoading]: isLoading,
                  })}
                >
                  Save changes
                </button>
                <div
                  className={s.editButton}
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Cancel
                </div>
              </>
            );
          }

          return (
            <Form>
              <div className={s.formRow}>
                <div className={s.formWrapper}>
                  <label className={s.formLabel}>FIRST NAME</label>
                  <Field
                    className={classNames({
                      [s.inputForm]: true,
                      [s.hasError]: !!errors.firstName && touched.firstName,
                    })}
                    name="firstName"
                    placeholder="First Name"
                    disabled={!editMode}
                  />
                  <ErrorMessage errorMsg={errors.firstName} />
                </div>
                <div className={s.formWrapper}>
                  <label className={s.formLabel}>LAST NAME</label>
                  <Field
                    className={classNames({
                      [s.inputForm]: true,
                      [s.hasError]: !!errors.lastName && touched.lastName,
                    })}
                    name="lastName"
                    placeholder="Last Name"
                    disabled={!editMode}
                  />
                  <ErrorMessage errorMsg={errors.lastName} />
                </div>
              </div>
              <div className={s.affiliationFormWrapper}>
                <label className={s.formLabel}>AFFILIATION / COMPANY</label>
                <Field
                  name="affiliation"
                  component={AffiliationSelectBox}
                  placeholder="Affiliation / Company"
                  className={classNames({
                    [s.inputForm]: true,
                    [s.hasError]: !!errors.affiliation && !!touched.affiliation,
                  })}
                  errorWrapperClassName={s.affiliationErrorMsg}
                  disabled={!editMode}
                  format={formatAffiliation}
                />
              </div>
              <div style={{ marginBottom: 36 }} className={s.formWrapper}>
                <label className={s.formLabel}>Profile Link</label>
                <Field
                  className={classNames({
                    [s.inputForm]: true,
                    [s.hasError]: !!errors.profileLink && touched.profileLink,
                  })}
                  name="profileLink"
                  placeholder="Profile Link"
                  disabled={!editMode}
                />
                <ErrorMessage errorMsg={errors.profileLink} />
              </div>
              {formButton}
            </Form>
          );
        }}
      />
      <div className={s.divider} />
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(withStyles<typeof ProfileFormContainer>(s)(ProfileFormContainer));
