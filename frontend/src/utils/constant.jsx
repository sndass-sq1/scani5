import { Link } from 'react-router-dom';
import AvatarComp from '../components/AvatarComp';
import TooltipComp from '../components/TooltipComp';
import { MdLockOpen } from 'react-icons/md';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { ucFirst } from './UcFirst';
import CopyableText from '../components/CopyableText';
import { Highlighter } from './Highlighter';
import { FormatDate } from './FormatDate';

const getSeverityClass = (score) => {
    if (score >= 0 && score < 30) return 'severity-score-low';
    if (score >= 30 && score < 50) return 'severity-score-medium';
    if (score >= 50 && score < 70) return 'severity-score-high';
    if (score >= 70 && score <= 100) return 'severity-score-critical';
    return '';
};

const checkShowButton = (row, action, mapActionFun) => {
    if ('showButton' in action) {
        return action.showButton(mapActionFun, row);
    }
    return true;
};

const addAssetUI = () => {
    return (
        <>
            <div className="assets-modal pb-4">
                <div className="asset-window d-flex m-t-30">
                    <p className="ms-2">Using CMD</p>
                </div>

                <div className="asset-display asset-window mt-2 d-flex justify-content-between align-items-center">
                    <img src="/images/badges/cmd.svg" alt="window" className=" me-3" />
                    <CopyableText text="msiexec scani5_v1.18.msi /q license=p$Em+n$m2Wbw44£U3X=Wf" />
                </div>

                <div className="asset-Linux d-flex m-t-25">
                    <p className="ms-2">Using Terminal</p>
                </div>

                <div className="asset-display asset-window mt-2 d-flex justify-content-between align-items-center ">
                    <img src="/images/badges/linux.svg" alt="linux" className=" me-3" />

                    <CopyableText text="sudo dpkg -i scani5_v1.9 license=p$Em+n$m2Wbw44£U3X=Wf" />
                </div>
            </div>
        </>
    );
};

export const formAPIData = [
    {
        login: {
            url: 'auth/login',
            mutationKey: 'userLogin',
            type: 'Login',
            header_details: {
                header: 'Login',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Login',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],

            successFun: 'loginSuccess',
            label_details: [
                {
                    value: 'Forgot Password?',
                    classValue: 'hyper-link m-t-42',
                    func: 'redirectToForgotPassword',
                },
            ],
        },
    },
    {
        forgot_password: {
            url: 'auth/forgot-password',
            mutationKey: 'forgotPassword',
            type: 'forgot_password',
            header_details: {
                header: 'Forgot your password?',
                header_class: 'mb-4',
                sub_header:
                    'Enter your email address and we will send you instructions to reset your password',
                sub_header_class: 'mb-4',
            },
            form_buttons: [
                {
                    label: 'Reset',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'route',
                    value: `${window?.location?.origin}/update-password`,
                    bind: false,
                },
            ],
            label_details: [
                {
                    value: 'Back to Login?',
                    classValue: 'hyper-link m-t-42',
                    func: 'redirectToLogin',
                },
            ],
        },
    },
    {
        update_password: {
            url: 'auth/update-password',
            mutationKey: 'updatePassword',
            type: 'updatePassword',
            header_details: {
                header: 'Update your password?',
            },
            form_buttons: [
                {
                    label: 'Update',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            label_details: [],
            getAPI: {
                customApi: (mapUrlParams) => {
                    return `auth/forgot-password-verifycheck/${mapUrlParams['routeParam']?.['token']}`;
                },
                query_name: 'verifyForgotPasswordToken',
            },
            additional_api_params: [
                {
                    name: 'token',
                    value: 'id',
                    bind: 'routeParam',
                },
            ],
        },
    },
    {
        register: {
            url: 'organizations/register',
            mutationKey: 'register',
            type: 'register',
            header_details: {
                header: 'Welcome to Scanify',
                header_class: 'text-dark fs-28 mb-2',
                sub_header: 'Please Register your account',
                sub_header_class: 'mb-3',
            },
            form_buttons: [
                {
                    label: 'Register',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'token',
                    value: 'id',
                    bind: 'routeParam',
                },
            ],
            successFun: 'registerSuccess',
            label_details: [],
            getAPI: {
                customApi: (mapUrlParams) => {
                    return `organizations/verify-link/${mapUrlParams['routeParam']?.['id']}`;
                },
                // url: 'organizations/verify-link',
                query_name: 'verifyRegister',
                // param: 'id',
            },
        },
    },
    {
        users: {
            url: 'organizations/invite',
            mutationKey: 'AddUser',
            invalidateQuery: ['getUsersCardsDetails', 'getUsers'],
            type: 'modalForm',
            header_details: {
                header: 'Add User',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Add User',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'route',
                    value: `${window?.location?.origin}/register`,
                    bind: false,
                },
                {
                    name: 'type',
                    customValue: (val) => {
                        return val['decrypytActiveRole'] === 'sq1 super admin'
                            ? 'sq1_user'
                            : 'org_user';
                    },
                },
                {
                    name: 'orgId',
                    customValue: (val) => {
                        return val['orgId'];
                    },
                },
            ],
            label_details: [],
        },
    },
    {
        organizations: {
            url: 'organizations/invite',
            mutationKey: 'AddOrganization',
            invalidateQuery: [
                'getOrganizationCardsDetails',
                'getOrganizations',
                'getOrganizationLists',
            ],
            type: 'modalForm',
            header_details: {
                header: 'Add Organization',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Add',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'route',
                    value: `${window?.location?.origin}/register`,
                    bind: false,
                },
                {
                    name: 'role_id',
                    value: 'id',
                    bind: 'getAPIData',
                    customValue: (val) => {
                        return val['getAPIData'].data[0].id;
                    },
                },
            ],
            getAPI: {
                customApi: (mapUrlParams) => {
                    return `organizations/roles?orgId=${mapUrlParams['orgId']}&type=add`;
                },
                query_name: 'getRolesByOrg',
                param: '',
            },
            label_details: [],
        },
    },
    {
        editorganization: {
            customApi: (mapUrlParams) => {
                return `organizations/update/${mapUrlParams['rowValues']?.['id']}`;
            },
            api_type: 'put',
            mutationKey: 'UpdateOrganization',
            invalidateQuery: ['getOrganizationCardsDetails', 'getOrganizations'],
            type: 'modalForm',
            header_details: {
                header: 'Edit organization',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Edit',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'id',
                    value: 'id',
                    bind: 'rowValues',
                },
            ],
            label_details: [],
        },
    },

    {
        tags: {
            url: 'tags',
            mutationKey: 'AddTags',
            invalidateQuery: ['getTags', 'getTagsCardsDetails'],
            type: 'modalForm',
            header_details: {
                header: 'Add Tags',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Add Tags',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'orgId',
                    bind: 'rowValues',
                    customValue: (val) => {
                        return val['orgId'];
                    },
                },
            ],
            label_details: [],
        },
    },
    {
        edittags: {
            url: 'tags/edit-tag',
            customApi: (mapUrlParams) => {
                return `tags/update/${mapUrlParams['rowValues']?.['id']}`;
            },
            mutationKey: 'UpdateTags',
            invalidateQuery: ['getTags'],
            type: 'modalForm',
            api_type: 'put',
            header_details: {
                header: 'Edit Tags',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Edit',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            label_details: [],
            additional_api_params: [
                {
                    name: 'orgId',
                    bind: 'rowValues',
                    customValue: (val) => {
                        return val['orgId'];
                    },
                },
            ],
        },
    },
    {
        profileSettings: {
            customApi: (mapUrlParams) => {
                return `users/${mapUrlParams['userId']}`;
            },
            // url: '/users/profile-update',
            mutationKey: 'ProfileUpdate',
            api_type: 'put',
            invalidateQuery: ['getProfile'],
            type: 'Profile Settings',
            header_details: {
                header: 'Profile Information',
                header_class: '',
            },

            has_avatar: true,
            form_buttons: [
                {
                    label: 'Update',
                    type: 'submit',
                    classValue: 'submit-btn',
                    // customShow: (orgId, decryptUserData) => {
                    //     if (orgId === decryptUserData.orgId) {
                    //         return true;
                    //     }
                    //     return false;
                    // },
                },
            ],
            successFun: 'changeProfilenameSuccess',
            getAPI: {
                customApi: (mapUrlParams) => {
                    return `users/${mapUrlParams['userId']}`;
                },
                query_name: 'getProfile',
            },
        },
    },
    {
        changePassword: {
            customApi: () => {
                return `users/change-password`;
            },
            // url: 'change-password',
            api_type: 'POST',
            mutationKey: 'ChangePassword',
            invalidateQuery: [],
            type: 'Change Password',
            header_details: {
                header: 'Change Password',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Update',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            successFun: 'changePasswordSuccess',
            additional_api_params: [
                {
                    name: 'user_id',
                    bind: 'rowValues',
                    customValue: (mapUrlParams) => {
                        return mapUrlParams['userId'];
                    },
                },
            ],
            label_details: [],
        },
    },
    {
        // update asset and report tag
        assettags: {
            url: 'tags/assign',

            mutationKey: 'UpdateAssetTags',
            invalidateQuery: ['getAssets', 'getReportAssets'],
            type: 'modalForm',
            header_details: {
                header: 'Update Tags',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Update',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'assetId',
                    value: 'id',
                    bind: 'rowValues',
                },
                {
                    name: 'type',
                    value: 'asset',
                },
                {
                    name: 'is_retired',
                    value: 0,
                },
                {
                    name: 'orgId',
                    bind: 'rowValues',
                    customValue: (val) => {
                        return val['orgId'];
                    },
                },
            ],
            // getAPI: {
            //     url: 'get-roles?type=addFlow',
            //     query_name: 'getRoles',
            //     param: '',
            // },
            label_details: [],
        },
    },
    {
        // update for retired  asset tag
        retiredassettags: {
            url: 'tags/assign',

            mutationKey: 'UpdateRetiredAssetTags',
            invalidateQuery: ['getRetiredAssets'],
            type: 'modalForm',
            header_details: {
                header: 'Update Tags',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Update',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'assetId',
                    value: 'id',
                    bind: 'rowValues',
                },
                {
                    name: 'type',
                    value: 'asset',
                },
                {
                    name: 'orgId',
                    bind: 'rowValues',
                    customValue: (val) => {
                        return val['orgId'];
                    },
                },

                {
                    name: 'is_retired',
                    value: 1,
                },
            ],
            // getAPI: {
            //     url: 'get-roles?type=addFlow',
            //     query_name: 'getRoles',
            //     param: '',
            // },
            label_details: [],
        },
    },
    {
        assetsreports: {
            url: 'assets/report',
            customApi: (mapUrlParams) => {
                return `assets/report?orgId=${mapUrlParams['orgId']}&id=${mapUrlParams['rowValues']?.['id']}`;
            },
            api_type: 'post',
            mutationKey: 'ReportAssets',
            invalidateQuery: ['getAssets'],
            type: 'modalForm',
            header_details: {
                header: 'Report Asset',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'No',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Yes',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                // {
                //     name: 'id',
                //     value: 'id',
                //     bind: 'rowValues',
                // },
            ],
            label_details: [],
        },
    },

    {
        // update vulnerability tag
        vulnerabilitytags: {
            url: 'tags/assign',

            mutationKey: 'UpdatevulnerabilityTags',
            invalidateQuery: ['getVulnerability'],
            type: 'modalForm',
            header_details: {
                header: 'Update Tags',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Update',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'assetId',
                    value: 'id',
                    bind: 'rowValues',
                },
                {
                    name: 'type',
                    value: 'vulnerability',
                },
                {
                    name: 'orgId',
                    bind: 'rowValues',
                    customValue: (val) => {
                        return val['orgId'];
                    },
                },
                {
                    name: 'is_retired',
                    value: 0,
                },
            ],
            label_details: [],
        },
    },

    {
        assetDetailsTags: {
            url: 'tags/assign',

            mutationKey: 'UpdateAssetDetailsTags',
            invalidateQuery: ['getAssetDetails'],
            type: 'modalForm',
            header_details: {
                header: 'Update Tags',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Update',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'assetId',
                    value: 'id',
                    bind: 'rowValues',
                },
                {
                    name: 'type',
                    value: 'asset',
                },
                {
                    name: 'is_retired',
                    value: 0,
                },
                {
                    name: 'orgId',
                    bind: 'rowValues',
                    customValue: (val) => {
                        return val['orgId'];
                    },
                },
            ],
            // getAPI: {
            //     url: 'get-roles?type=addFlow',
            //     query_name: 'getRoles',
            //     param: '',
            // },
            label_details: [],
        },
    },
    {
        orgUsers: {
            url: 'organizations/invite',
            mutationKey: 'InviteUserByOrg',
            invalidateQuery: ['getOrgUsers', 'getOrgUsersCardsDetails'],
            type: 'modalForm',
            header_details: {
                header: 'Invite user',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Invite user',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'route',
                    value: `${window?.location?.origin}/register`,
                    bind: false,
                },
                {
                    name: 'orgId',
                    customValue: (val) => {
                        return val['routeParam']?.['id'];
                    },
                },
            ],
            label_details: [],
        },
    },
    {
        usersOrg: {
            url: 'users/assign-organizations',
            mutationKey: 'AssignOrgByUsers',
            invalidateQuery: ['getUsersOrg', 'getUsersOrgCardsDetails'],
            type: 'modalForm',
            header_details: {
                header: 'Assign Organization',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Assign',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'user_id',
                    value: 'id',
                    bind: 'routeParam',
                },
            ],
            label_details: [],
        },
    },
    {
        editUsersOrg: {
            url: 'organizations/edit-role',
            mutationKey: 'EditUsersOrgRole',
            invalidateQuery: ['getUsersOrg'],
            type: 'modalForm',
            header_details: {
                header: 'Edit role',
                header_class: '',
            },
            form_buttons: [
                {
                    label: 'Cancel',
                    type: 'button',
                    classValue: 'outline-btn',
                },
                {
                    label: 'Edit',
                    type: 'submit',
                    classValue: 'submit-btn',
                },
            ],
            additional_api_params: [
                {
                    name: 'userId',
                    value: 'id',
                    bind: 'routeParam',
                },
                {
                    name: 'orgId',
                    customValue: (val) => {
                        return val['rowValues']?.['id'];
                    },
                },
            ],
            label_details: [],
        },
    },
];

export const formFields = [
    {
        login: [
            {
                client_name: 'login_email',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'email',
                label: 'Email',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'email',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'login_password',
                type: 'password',
                placeholder: 'Password',
                backend_name: 'password',
                label: 'Password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'password',
                    },
                    { type: 'min', value: 8 },
                ],
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        forgot_password: [
            {
                client_name: 'forgot_password_email',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'email',
                label: 'Email',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'email',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'recaptcha',
                type: 'recaptcha',
                placeholder: '',
                backend_name: 'g-recaptcha-response',
                label: 'Recaptcha',
                show_label: false,
                mandatory: true,
                validation: [
                    {
                        type: 'recaptcha',
                    },
                ],
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        update_password: [
            {
                client_name: 'password',
                type: 'password',
                placeholder: 'Password',
                backend_name: 'password',
                label: 'Password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'password',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'confirm_password',
                type: 'password',
                placeholder: 'Confirm Password',
                backend_name: 'confirm_password',
                label: 'Confirm password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'confirm_password',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'recaptcha',
                type: 'recaptcha',
                placeholder: '',
                backend_name: 'token',
                label: 'Recaptcha',
                show_label: false,
                mandatory: true,
                validation: [
                    {
                        type: 'recaptcha',
                    },
                ],
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        register: [
            {
                client_name: 'user_name',
                type: 'text',
                placeholder: 'Name',
                backend_name: 'name',
                label: 'Name',
                show_label: true,
                mandatory: true,
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'user_email',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'email',
                label: 'Email',
                show_label: true,
                disabled: true,
                value: 'getAPIData',
                bind: true,
                send_to_backend: false,
                mandatory: false,
                validation: [
                    {
                        type: 'email',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'password',
                type: 'password',
                placeholder: 'Password',
                backend_name: 'password',
                label: 'Password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'password',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'confirm_password',
                type: 'password',
                placeholder: 'Confirm password',
                backend_name: 'confirm_password',
                label: 'Confirm password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'confirm_password',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'recaptcha',
                type: 'recaptcha',
                placeholder: '',
                backend_name: 'g-recaptcha-response',
                label: 'Recaptcha',
                show_label: false,
                mandatory: true,
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        users: [
            {
                client_name: 'users_email',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'email',
                label: 'Email',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'email',
                    },
                    { type: 'min', value: 3 },
                    { type: 'max', value: 30 },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'get-roles',
                type: 'dropdown',
                placeholder: 'Role',
                backend_name: 'role_id',
                label: 'Role',
                mandatory: true,
                options: [],
                optionDetails: {
                    customApi: (mapUrlParams) => {
                        return `organizations/roles?orgId=${mapUrlParams['orgId']}`;
                    },
                    type: 'users',
                    query_name: 'getRolesListByUsers',
                    label_backend_name: 'name',
                    sublabel_backend_name: '',
                },
            },
        ],
    },
    {
        organizations: [
            {
                client_name: 'org_name',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'name',
                label: 'Name',
                show_label: true,
                mandatory: true,
                validation: [
                    { type: 'min', value: 3 },
                    {
                        type: 'max',
                        value: 20,
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'org_email',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'email',
                label: 'Email',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'email',
                    },
                    { type: 'min', value: 3 },
                    { type: 'max', value: 30 },
                ],
                options: [],
                optionDetails: {},
            },

            {
                client_name: 'org_role',
                type: 'text',
                placeholder: 'role_id',
                backend_name: 'role_id',
                label: 'Role',
                show_label: true,
                mandatory: true,
                options: [],
                send_to_backend: false,
                optionDetails: {},
                bind: false,
                value: 'Super Admin',
                disabled: true,
            },
        ],
    },
    {
        editorganization: [
            {
                client_name: 'org_name',
                type: 'text',
                placeholder: 'Organization name',
                backend_name: 'name',
                label: 'Organization name',
                show_label: true,
                mandatory: true,
                validation: [
                    { type: 'min', value: 3 },
                    {
                        type: 'max',
                        value: 20,
                    },
                ],
                bind: 'rowValues',
                value: 'name',
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        assetsreports: [
            {
                client_name: 'comment',
                type: 'textarea',
                placeholder: 'Reason to Report',
                backend_name: 'comment',
                label: 'Reason to Report',
                show_label: true,
                mandatory: true,
                validation: [
                    { type: 'min', value: 3 },
                    {
                        type: 'max',
                        value: 20,
                    },
                ],
                bind: 'rowValues',
                value: 'comment',
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        tags: [
            {
                client_name: 'tag',
                type: 'text',
                placeholder: 'Add Tag',
                backend_name: 'name',
                label: 'Tag',
                show_label: true,
                mandatory: true,
                options: [],
                validation: [
                    {
                        type: 'max',
                        value: 50,
                    },
                ],
                optionDetails: {},
            },
        ],
    },
    {
        edittags: [
            {
                client_name: 'name',
                type: 'text',
                placeholder: 'Edit Tag',
                backend_name: 'name',
                label: 'Edit Tag',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'max',
                        value: 50,
                    },
                ],
                bind: 'rowValues',
                value: 'name',
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        assettags: [
            {
                client_name: 'name',
                type: 'multi_select_dropdown',
                placeholder: 'Edit Tag',
                backend_name: 'tagId',
                label: 'Edit Tag',
                show_label: true,
                mandatory: true,
                validation: [
                    { type: 'min', value: 3 },
                    {
                        type: 'max',
                        value: 20,
                    },
                ],
                bind: 'rowValues',
                value: 'name',
                options: [],
                optionDetails: {
                    url: 'get-tag',
                    // type: 'teams',
                    customApi: (mapUrlParams) => {
                        return `tags?orgId=${mapUrlParams['orgId']}`;
                    },
                    query_name: 'getAssetsTags',
                    label_backend_name: 'name',
                    // sublabel_backend_name: 'coder_id',
                },
            },
        ],
    },
    {
        retiredassettags: [
            {
                client_name: 'name',
                type: 'multi_select_dropdown',
                placeholder: 'Edit Tag',
                backend_name: 'tagId',
                label: 'Edit Tag',
                show_label: true,
                mandatory: true,
                validation: [
                    { type: 'min', value: 3 },
                    {
                        type: 'max',
                        value: 20,
                    },
                ],
                bind: 'rowValues',
                value: 'name',
                options: [],
                optionDetails: {
                    url: 'get-tag',
                    // type: 'teams',
                    customApi: (mapUrlParams) => {
                        return `tags?orgId=${mapUrlParams['orgId']}`;
                    },
                    query_name: 'getAssetsTags',
                    label_backend_name: 'name',
                    // sublabel_backend_name: 'coder_id',
                },
            },
        ],
    },
    {
        vulnerabilitytags: [
            {
                client_name: 'name',
                type: 'multi_select_dropdown',
                placeholder: 'Edit Tag',
                backend_name: 'tagId',
                label: 'Tag',
                show_label: true,
                mandatory: true,
                validation: [
                    { type: 'min', value: 3 },
                    {
                        type: 'max',
                        value: 20,
                    },
                ],
                bind: 'rowValues',
                value: 'name',
                options: [],
                optionDetails: {
                    url: 'get-tag',
                    // type: 'teams',
                    customApi: (mapUrlParams) => {
                        return `tags?orgId=${mapUrlParams['orgId']}`;
                    },
                    query_name: 'getvulnerabilityTags',
                    label_backend_name: 'name',
                    // sublabel_backend_name: 'coder_id',
                },
            },
        ],
    },
    {
        assetDetailsTags: [
            {
                client_name: 'name',
                type: 'multi_select_dropdown',
                placeholder: 'Edit Tag',
                backend_name: 'tagId',
                label: 'Tag',
                show_label: true,
                mandatory: true,
                validation: [
                    { type: 'min', value: 3 },
                    {
                        type: 'max',
                        value: 20,
                    },
                ],
                bind: 'rowValues',
                value: 'name',
                options: [],
                optionDetails: {
                    url: 'get-tag',
                    // type: 'teams',
                    customApi: (mapUrlParams) => {
                        return `tags?orgId=${mapUrlParams['orgId']}`;
                    },
                    query_name: 'getAssetsDetailsTags',
                    label_backend_name: 'name',
                    // sublabel_backend_name: 'coder_id',
                },
            },
        ],
    },
    {
        profileSettings: [
            {
                client_name: 'name',
                type: 'avatar',
                placeholder: 'Edit Tag',
                backend_name: 'name',
                label: 'Name',
                show_label: true,
                mandatory: true,
                value: 'getAPIData',
                bind: true,
                validation: [{ type: 'min', value: 3 }],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'company_name',
                type: 'text',
                placeholder: 'Company Name',
                backend_name: 'companyname',
                label: 'Company Name',
                show_label: true,
                value: 'decryptActiveOrgName',
                bind: true,
                mandatory: true,
                disabled: true,
                validation: [{ type: 'min', value: 3 }],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'org_email',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'email',
                label: 'Email',
                show_label: true,
                disabled: true,
                value: 'getAPIData',
                bind: true,
                mandatory: true,
                validation: [
                    {
                        type: 'email',
                    },
                ],
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        changePassword: [
            {
                client_name: 'old_password',
                type: 'password',
                placeholder: 'Old Password',
                backend_name: 'old_password',
                label: 'Old Password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'old_password',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'password',
                type: 'password',
                placeholder: 'New Password',
                backend_name: 'new_password',
                label: 'New Password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'password',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'confirm_password',
                type: 'password',
                placeholder: 'Confirm Password',
                backend_name: 'confirm_password',
                label: 'Confirm Password',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'confirm_password',
                    },
                ],
                options: [],
                optionDetails: {},
            },
        ],
    },
    {
        orgUsers: [
            {
                client_name: 'users_email',
                type: 'text',
                placeholder: 'Email',
                backend_name: 'email',
                label: 'Email',
                show_label: true,
                mandatory: true,
                validation: [
                    {
                        type: 'email',
                    },
                ],
                options: [],
                optionDetails: {},
            },
            {
                client_name: 'get-roles',
                type: 'dropdown',
                placeholder: 'Role',
                backend_name: 'role_id',
                label: 'Role',
                mandatory: true,
                options: [],
                optionDetails: {
                    customApi: (mapUrlParams) => {
                        return `organizations/roles?orgId=${mapUrlParams['routeParam']?.['id']}&type=assign`;
                    },
                    params: (mapUrlParams) => {
                        return {
                            orgId: mapUrlParams['routeParam']?.['id'],
                        };
                    },
                    type: 'users',
                    query_name: 'getRolesListByOrgUsers',
                    label_backend_name: 'name',
                    sublabel_backend_name: '',
                },
            },
        ],
    },
    {
        usersOrg: [
            {
                client_name: 'org_name',
                type: 'dropdown',
                placeholder: 'Email',
                backend_name: 'orgId',
                label: 'Organization',
                show_label: false,
                mandatory: true,
                validation: [],
                options: [],
                optionDetails: {
                    customApi: (mapUrlParams) => {
                        return `organizations/assign?orgId=${mapUrlParams['orgId']}`;
                    },
                    type: 'orgList',
                    query_name: 'getorgListByUsersOrg',
                    label_backend_name: 'name',
                    sublabel_backend_name: '',
                },
            },
            {
                client_name: 'role',
                type: 'dropdown',
                placeholder: 'Email',
                backend_name: 'role_id',
                label: 'Role',
                show_label: false,
                mandatory: true,
                validation: [],
                options: [],
                optionDetails: {
                    url: 'organizations/roles',
                    disabled: (mapDropdownDisable) => {
                        return !mapDropdownDisable['formikAdd'].values['org_name'];
                    },
                    type: 'users',
                    query_name: 'getRolesListByUsersOrg',
                    label_backend_name: 'name',
                    sublabel_backend_name: '',
                    params: (mapUrlParams) => {
                        return {
                            orgId: mapUrlParams['formikAdd'].values['org_name'],
                            user_id: mapUrlParams['routeParam']?.['id'],
                        };
                    },
                    enabled: (mapDropdownParam) => {
                        return !!mapDropdownParam['formikAdd'].values['org_name'];
                    },
                },
            },
        ],
    },
    {
        editUsersOrg: [
            {
                client_name: 'role',
                type: 'dropdown',
                placeholder: 'Email',
                backend_name: 'roleId',
                label: 'Role',
                show_label: false,
                mandatory: true,
                validation: [],
                options: [],
                optionDetails: {
                    url: 'organizations/roles',
                    type: 'users',
                    query_name: 'getRolesListByUsersOrgEdit',
                    label_backend_name: 'name',
                    sublabel_backend_name: '',
                    params: (mapDropdownParam) => {
                        return {
                            orgId: mapDropdownParam['rowValues']?.['id'],
                        };
                    },
                },
            },
        ],
    },
];

export const tableDetails = [
    {
        users: {
            url: 'users',
            query_name: 'getUsers',
            title: 'Add User',
            canExpand: false,
            canSort: true,
            search_filter: true,
            addbutton: (mapParams) => {
                if (
                    ['sq1 super admin', 'sq1 admin', 'org super admin', 'org admin'].includes(
                        mapParams['decrypytActiveRole']
                    )
                ) {
                    return true;
                }
                return false;
            },
            hideColumns: (mapActionFun) => {
                const orgsCountFn = () => {
                    if (
                        ['sq1 super admin', 'sq1 admin', 'sq1 user'].includes(
                            mapActionFun['decrypytActiveRole']
                        )
                    ) {
                        return true;
                    }

                    return false;
                };
                return {
                    organizations_count: orgsCountFn(),
                };
            },
            filter: true,
        },
    },
    {
        organizations: {
            url: 'organizations',
            query_name: 'getOrganizations',
            title: 'Add Organization',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: true,
            addbutton: (mapParams) => {
                if (['sq1 super admin'].includes(mapParams['decrypytActiveRole'])) {
                    return true;
                }
                return false;
            },
        },
    },
    {
        activitylog: {
            url: 'logs',
            query_name: 'getActivitylog',
            title: 'User activity log',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: true,
            addbutton: false,
            date_range: true,
        },
    },
    {
        assets: {
            url: `assets`,
            query_name: 'getAssets',
            title: 'Add Assets',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: true,
            export: true,
            rowselect: true,
            customRender: () => {
                return addAssetUI();
            },
            addbutton: (mapParams) => {
                if (['org super admin', 'org admin'].includes(mapParams['decrypytActiveRole'])) {
                    return true;
                }
                return false;
            },
        },
    },
    {
        retiredassets: {
            url: `assets?is_retired=true`,
            query_name: 'getRetiredAssets',
            title: 'Add Assets',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: true,
            addbutton: false,
            export: true,
            rowselect: true,
        },
    },

    {
        reportassets: {
            url: `assets?is_reported=true`,
            query_name: 'getReportAssets',
            title: 'Add Assets',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: true,
            addbutton: false,
            export: true,
            rowselect: true,
        },
    },
    {
        vulnerabilityassets: {
            url: `assets?vulnerability_assets=true`,
            query_name: 'getVulnerabilityAssets',
            title: 'Add Assets',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: true,
            addbutton: false,
            export: true,
            rowselect: true,
        },
    },
    {
        vulnerability: {
            customApi: (mapUrlParams) => {
                if (!!mapUrlParams['routeParam']?.['id']) {
                    return `vulnerabilities/asset-vulnerabilities/${mapUrlParams['routeParam']?.['id']}`;
                }
                return `vulnerabilities`;
            },
            params: (mapUrlParams) => {
                return {
                    asset_id: mapUrlParams['routeParam']?.['id'],
                    type: mapUrlParams['routeParam']?.['type'],
                };
            },
            query_name: 'getVulnerability',
            title: 'Add Vulnerability',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: true,
            addbutton: false,
            export: true,
            report: true,
        },
    },
    {
        reports: {
            url: '/reports',
            query_name: 'getReports',
            title: 'Add Reports',
            canExpand: false,
            canSort: true,
            search_filter: false,
            filter: false,
            addbutton: false,
        },
    },
    {
        tags: {
            url: 'tags',
            query_name: 'getTags',
            title: 'Add Tags',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: false,
            addbutton: true,
        },
    },
    {
        exploits: {
            customApi: (mapUrlParams) => {
                if (!!mapUrlParams['routeParam']?.['id']) {
                    return `vulnerabilities/vulnerability-exploits/${mapUrlParams['routeParam']?.['id']}`;
                }
                return `vulnerabilities/total-exploits`;
            },
            params: (mapUrlParams) => {
                return {
                    asset_id: mapUrlParams['routeParam']?.['id'],
                };
            },
            query_name: 'getExploits',
            title: 'Exploits',
            canExpand: false,
            canSort: true,
            search_filter: true,
            filter: false,
            addbutton: false,
            // showstatuscard: false,
        },
    },
    {
        usersOrg: {
            customApi: (mapUrlParams) => {
                return `organizations/user-organizations/${mapUrlParams['routeParam']?.['id']}`;
            },
            params: (mapUrlParams) => {
                return {
                    user_id: mapUrlParams['routeParam']?.['id'],
                };
            },
            query_name: 'getUsersOrg',
            title: 'Assign Organization',
            canExpand: false,
            canSort: true,
            search_filter: true,
            addbutton: (mapParams) => {
                if (['sq1 super admin'].includes(mapParams['decrypytActiveRole'])) {
                    return true;
                }
                return false;
            },
            filter: false,
        },
    },
    {
        orgUsers: {
            // url: 'users/org-through-user',
            customApi: (mapUrlParams) => {
                return `users/organization-users/${mapUrlParams['routeParam']?.['id']}`;
            },
            params: (mapUrlParams) => {
                return {
                    orgId: mapUrlParams['routeParam']?.['id'],
                };
            },
            query_name: 'getOrgUsers',
            title: 'Invite User',
            canExpand: false,
            canSort: true,
            search_filter: true,
            addbutton: (mapParams) => {
                if (['sq1 super admin', 'sq1 admin'].includes(mapParams['decrypytActiveRole'])) {
                    return true;
                }
                return false;
            },
            filter: true,
        },
    },
    {
        vulpatches: {
            customApi: (mapUrlParams) => {
                return `vulnerabilities/patch/${mapUrlParams['routeParam']?.['id']}`;
            },
            query_name: 'getVulnerabilityPatchDetails',
            params: (mapUrlParams) => {
                if (!!mapUrlParams['routeParam']?.['id']) {
                    return {
                        vul_id: mapUrlParams['routeParam']?.['id'],
                    };
                }
            },
            // title: 'Invite User',
            canExpand: false,
            canSort: true,
            search_filter: false,
            showstatuscard: false,
        },
    },
    // {
    //     vulexploits: {
    //         customApi: (mapUrlParams) => {
    //             return `vulnerabilities/vulnerability-exploits/${mapUrlParams['routeParam']?.['id']}`;
    //         },
    //         query_name: 'getVulnerabilityExploitsDetails',
    //         // title: 'Invite User',
    //         canExpand: false,
    //         canSort: true,
    //         search_filter: false,
    //         showstatuscard: false,
    //     },
    // },
];

export const tableHeaders = [
    {
        users: [
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'name',
                label: 'Name ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <>
                        {row?.original.name ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={ucFirst(row?.original.name)}
                            />
                        ) : (
                            '-'
                        )}
                    </>
                ),
            },
            {
                backend_name: 'email',
                label: 'Email ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'role_name',
                label: 'Role',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <div className="text-capitalize">
                        {cell.renderValue ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={cell.renderValue()}
                            />
                        ) : (
                            cell
                        )}
                    </div>
                ),
            },
            {
                backend_name: 'organizations_count',
                label: 'Organizations',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) =>
                   
                    cell.renderValue() ? (
                        <div className="cus-count Ips-count text-center">
                            <Link
                                className=''
                                to={`/users/organization/${row.original.id}`}
                                state={row.original.name || 'User'}>
                                {cell.renderValue ? cell.renderValue() : cell} 
                            </Link>
                        </div>
                    ) : (
                        <div className=" text-center">-</div>
                    ),
                    
            },
            {
                backend_name: 'status',
                label: 'Status',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: function (_, cell, mapActionFun) {
                    const value = cell.renderValue();
                    return (
                        <div className="cus-badges">
                            <div className={value}>
                                <span>
                                    <img
                                        src={`/images/badges/${value}.svg`}
                                        alt={`${value}-image`}
                                    />
                                </span>
                                <span>
                                    <Highlighter
                                        searchVal={mapActionFun['searchVal']}
                                        text={value}
                                    />
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                backend_name: '',
                label: 'Actions',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [
                    {
                        button: 'resend',
                        api: 'organizations/reinvite',
                        invalidateQuery: ['getUsers', 'getUsersCardsDetails'],
                        type: 'modal',
                        mutationKey: 'ResendByUsers',
                        api_type: 'post',
                        disabled: (row, mapActionFun) => {
                            const { id, status } = row?.original;
                            if (id === mapActionFun['decrypytUserData']?.userid) {
                                return true;
                            }
                            return status?.toLowerCase() === 'verified';
                        },
                        showButton: (mapActionFun) => {
                            if (
                                [
                                    'sq1 super admin',
                                    'sq1 admin',
                                    'org super admin',
                                    'org admin',
                                ].includes(mapActionFun['decrypytActiveRole'])
                            ) {
                                return true;
                            }

                            return false;
                        },
                        modal_details: {
                            title: 'Resend invite',
                            label: 'Are you sure want to invite the user? ',
                        },
                        additional_api_params: [
                            {
                                name: 'route',
                                value: `${window?.location?.origin}/register`,
                                bind: false,
                            },
                            {
                                name: 'email',
                                value: 'email',
                                bind: 'row',
                            },
                            {
                                name: 'orgId',
                                bind: 'row',
                                customValue: (val) => {
                                    return val['orgId'];
                                },
                            },
                        ],
                    },
                    {
                        button: 'regenerate',
                        api: '/mfa/regenerate/totp',
                        invalidateQuery: ['getUsers'],
                        type: 'modal',
                        showButton: (mapActionFun) => {
                            if (
                                ['sq1 super admin', 'sq1 admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                        disabled: (row, mapActionFun) => {
                            const { id, regenerate_reason } = row?.original;
                            if (
                                id === mapActionFun['decrypytUserData']?.userid ||
                                !regenerate_reason
                                // ||
                                // ['pending', 'expired', 'invited'].includes(status?.toLowerCase())
                            ) {
                                return true;
                            }
                            return false;
                        },
                        customRender: (row) => {
                            return (
                                <>
                                    <div className="alert alert-warning m-b-10" role="alert">
                                        <span className="fw-bold">Reason : </span>
                                        {row?.regenerate_reason}
                                    </div>
                                </>
                            );
                        },
                        api_type: 'post',
                        mutationKey: 'RegenerateByUser',
                        modal_details: {
                            title: 'Regenerate TOTP',
                            label: 'Are you sure want to regenerate the TOTP? ',
                        },
                        additional_api_params: [
                            {
                                name: 'route',
                                value: `${window?.location?.origin}/login`,
                                bind: false,
                            },
                            {
                                name: 'email',
                                value: 'email',
                                bind: 'row',
                            },
                        ],
                    },
                    {
                        button: 'unlock',
                        api: 'users/unlock',
                        invalidateQuery: ['getUsers'],
                        type: 'modal',
                        mutationKey: 'UnlockByUser',
                        api_type: 'post',
                        disabled: (row) => {
                            return !row?.original?.is_locked;
                        },
                        // showButton: (mapActionFun) => {
                        //     if (['sq1 super admin', 'sq1 admin', 'org super admin', 'org admin'].includes(
                        //         mapActionFun['decrypytActiveRole']
                        //     )) {
                        //         return true;
                        //     }
                        //     return false;
                        // },
                        modal_details: {
                            title: 'Account Unlock',
                            label: 'Are you sure want to unlock the account? ',
                        },
                        additional_api_params: [
                            {
                                name: 'user_id',
                                value: 'id',
                                bind: 'row',
                            },
                        ],
                    },
                    {
                        button: 'delete',
                        customApi: (mapUrlParams) => {
                            return `users/${mapUrlParams['orgId']}/${mapUrlParams['id']}`;
                        },
                        invalidateQuery: ['getUsers', 'getUsersCardsDetails'],
                        type: 'modal',
                        disabled: (row, mapActionFun) => {
                            const { id } = row.original;
                            if (
                                id === mapActionFun['decrypytUserData']?.userid ||
                                ['org user', 'sq1 user'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                        showButton: (mapActionFun, row) => {
                            if (
                                [
                                    'sq1 super admin',
                                    'sq1 admin',
                                    'org super admin',
                                    'org admin',
                                ].includes(mapActionFun['decrypytActiveRole'])
                            ) {
                                return true;
                            }
                            return false;
                        },
                        mutationKey: 'deleteUser',
                        api_type: 'delete',
                        modal_details: {
                            title: 'Delete User',
                            label: 'Are you sure want to delete this? ',
                        },
                    },
                ],
                editable: false,
                editDetails: {},
                customRender: function (row, _, mapActionFun) {
                    return (
                        <div className="actions-container">
                            {this.actions?.map((action, index) => {
                                const value = action.button;
                                return (
                                    <div
                                        key={`${value}_action_button${index}`}
                                        className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                        <TooltipComp position="top" content={value}>
                                            <button
                                                disabled={
                                                    'disabled' in action
                                                        ? action.disabled(row, mapActionFun)
                                                        : false
                                                }
                                                onClick={() =>
                                                    mapActionFun['handleActionModal'](row, action)
                                                }>
                                                {value === 'unlock' ? (
                                                    <MdLockOpen style={{ fontSize: '18px' }} />
                                                ) : (
                                                    <img
                                                        src={`/images/${value}.svg`}
                                                        alt={`${value}`}
                                                    />
                                                )}
                                            </button>
                                        </TooltipComp>
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
        ],
    },
    {
        organizations: [
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'name',
                label: 'Name ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        {cell.getValue() ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={ucFirst(cell.getValue())}
                            />
                        ) : (
                            '-'
                        )}
                    </>
                ),
            },
            {
                backend_name: 'email',
                label: 'Email ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'users',
                label: 'Users',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: function (row, cell, mapActionFun) {
                    const { id } = row.original;
                    const activeUserRole = mapActionFun['decrypytUserData']?.role?.toLowerCase();
                    const isSuperAdmin = activeUserRole === 'sq1 super admin';

                    // Disable for all except for specific IDs or if the user is a Super Admin
                    const isDisabled =
                        !isSuperAdmin &&
                        !mapActionFun['decrypytOrgData']?.some((val) => val.id === id);

                    return (
                        <AvatarComp
                            list={cell?.getValue()}
                            clickFn={
                                !isDisabled
                                    ? () =>
                                          mapActionFun['navigateToOrgUsers'](
                                              row.original.id,
                                              row.original.name
                                          )
                                    : undefined
                            }
                            disabled={isDisabled}
                        />
                    );
                },
            },
            {
                backend_name: 'status',
                label: 'Status',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: function (_, cell, mapActionFun) {
                    const value = cell.renderValue();
                    return (
                        <div className="cus-badges">
                            <div className={`${value === 'active' ? 'active' : 'inactive'}`}>
                                <span>
                                    <img src={`/images/${value}.svg`} alt={`${value}-image`} />
                                </span>
                                <span>
                                    <Highlighter
                                        searchVal={mapActionFun['searchVal']}
                                        text={value}
                                    />
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                backend_name: '',
                label: 'Actions',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [
                    {
                        button: 'edit',
                        invalidateQuery: ['getOrganizations'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'editorganization',
                    },
                    {
                        button: 'delete',
                        api: 'organizations/delete-organizations',
                        customApi: (mapUrlParams) => {
                            return `organizations/delete/${mapUrlParams['id']}`;
                        },
                        invalidateQuery: [
                            'getOrganizations',
                            'getOrganizationCardsDetails',
                            'getOrganizationLists',
                        ],
                        type: 'modal',
                        mutationKey: 'deleteOrganizations',
                        api_type: 'delete',
                        modal_details: {
                            title: 'Delete Organization',
                            label: 'Are you sure want to delete this? ',
                        },
                    },
                    {
                        button: 'enable',
                        api: 'organizations/org-status',
                        invalidateQuery: [
                            'getOrganizations',
                            'getOrganizationCardsDetails',
                            'getOrganizationLists',
                        ],
                        type: 'modal',
                        mutationKey: 'EnableOrganization',
                        api_type: 'post',
                        modal_details: {
                            title: (row) => {
                                const { status } = row.original;
                                return `${status === 'active' ? 'Disable' : 'Enable'} organization`;
                            },
                            label: (row) => {
                                const { status } = row.original;
                                return `Are you sure want to ${status === 'active' ? ' disable' : ' enable'} the organization?`;
                            },
                        },
                        additional_api_params: [
                            {
                                name: 'id',
                                value: 'id',
                                bind: 'row',
                            },
                            {
                                name: 'status',
                                value: `status`,
                                bind: 'row',
                                customValue: (val) => {
                                    return val['row']?.status === 'active' ? 'inactive' : 'active';
                                },
                            },
                        ],
                    },
                    {
                        button: 'resend',
                        api: 'organizations/reinvite',
                        invalidateQuery: ['getOrganizations'],
                        type: 'modal',
                        mutationKey: 'ResendByOrg',
                        api_type: 'post',
                        disabled: (row) => {
                            const { status } = row?.original;
                            return status.toLowerCase() === 'active';
                        },
                        modal_details: {
                            title: 'Resend invite',
                            label: 'Are you sure want to invite the user? ',
                        },
                        additional_api_params: [
                            {
                                name: 'route',
                                value: `${window?.location?.origin}/register`,
                                bind: false,
                            },
                            {
                                name: 'email',
                                value: 'email',
                                bind: 'row',
                            },
                            {
                                name: 'orgId',
                                value: 'id',
                                bind: 'row',
                            },
                        ],
                    },
                    {
                        button: 'regenerate',
                        api: '/mfa/regenerate/totp',
                        invalidateQuery: ['getOrganizations'],
                        type: 'modal',
                        api_type: 'post',
                        mutationKey: 'RegenerateByOrg',
                        modal_details: {
                            title: 'Regenerate TOTP',
                            label: 'Are you sure want to regenerate the TOTP? ',
                        },
                        // showButton: (mapActionFun) => {
                        //     if (
                        //         ['sq1 super admin', 'sq1 admin'].includes(
                        //             mapActionFun['decrypytActiveRole']
                        //         )
                        //     ) {
                        //         return true;
                        //     }
                        //     return false;
                        // },
                        disabled: (row) => {
                            const { regenerate_reason } = row?.original;
                            return !regenerate_reason;

                            // ||
                            // ['verified', 'expired'].includes(status?.toLowerCase())
                        },
                        customRender: (row) => {
                            return (
                                <>
                                    <div className="alert alert-warning m-b-10" role="alert">
                                        <span className="fw-bold">Reason : </span>
                                        {row?.regenerate_reason}
                                    </div>
                                </>
                            );
                        },
                        additional_api_params: [
                            {
                                name: 'route',
                                value: `${window?.location?.origin}/login`,
                                bind: false,
                            },
                            {
                                name: 'email',
                                value: 'email',
                                bind: 'row',
                            },
                        ],
                    },
                ],
                editable: false,
                editDetails: {},
                customRender: function (row, _, mapActionFun) {
                    if (mapActionFun['decrypytActiveRole'] === 'sq1 super admin') {
                        return (
                            <div className="actions-container">
                                {this.actions.map((action, index) => {
                                    let value = action.button;
                                    if (action.button === 'enable') {
                                        value =
                                            row.original.status === 'active' ? 'disable' : 'enable';
                                    }
                                    return (
                                        <div
                                            key={`${value}_action_button${index}`}
                                            className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                            <TooltipComp position="top" content={value}>
                                                <button
                                                    disabled={
                                                        'disabled' in action
                                                            ? action.disabled(row)
                                                            : false
                                                    }
                                                    onClick={() =>
                                                        mapActionFun['handleActionModal'](
                                                            row,
                                                            action
                                                        )
                                                    }>
                                                    <img
                                                        src={`/images/${value}.svg`}
                                                        alt={`${value}-image`}
                                                    />
                                                </button>
                                            </TooltipComp>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }
                },
            },
        ],
    },
    {
        activitylog: [
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'org_name',
                label: 'Organization Name ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        {cell.getValue() ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={ucFirst(cell.getValue())}
                            />
                        ) : (
                            '-'
                        )}
                    </>
                ),
            },
            {
                backend_name: 'date',
                label: 'Date ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'action',
                label: 'Action ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: function (_, cell) {
                    const value = cell.renderValue()?.toLocaleLowerCase();

                    return (
                        <div className="cus-badges">
                            <div className={value}>
                                <span>
                                    <img
                                        src={`/images/badges/${value}.svg`}
                                        alt={`${value}`}
                                        onError={(e) => {
                                            e.currentTarget.src = '/images/badges/fallback.svg';
                                            const parentDiv = e.currentTarget.closest('div');
                                            if (parentDiv) {
                                                parentDiv.classList.add('fallback');
                                            }
                                        }}
                                    />
                                </span>
                                <span>{value}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                backend_name: 'module',
                label: 'Module ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        {cell.getValue() ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={ucFirst(cell.getValue())}
                            />
                        ) : (
                            '-'
                        )}
                    </>
                ),
            },
            {
                backend_name: 'details',
                label: 'Logs ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        {cell.getValue() ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={ucFirst(cell.getValue())}
                            />
                        ) : (
                            '-'
                        )}
                    </>
                ),
            },
            {
                backend_name: 'user_ip',
                label: 'IP',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
        ],
    },
    {
        assets: [
            {
                backend_name: '',
                label: '#',
                headerCustomRender: (table) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: table.getIsAllRowsSelected(),
                                    indeterminate: table.getIsSomeRowsSelected(),
                                    onChange: table.getToggleAllRowsSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: row.getIsSelected(),
                                    onChange: row.getToggleSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
            },
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <>
                        <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                    </>
                ),
            },
            {
                backend_name: 'host_name',
                label: 'Asset ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                editable: false,
                editDetails: {},
                actions: [
                    {
                        button: 'edit',
                        invalidateQuery: ['getAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assetsreports',
                    },
                    {
                        button: 'delete',
                        api: 'asset-retire',
                        customApi: (mapUrlParams) => {
                            return `assets/retire?orgId=${mapUrlParams['orgId']}&id=${mapUrlParams['id']}`;
                        },
                        invalidateQuery: [
                            'getAssets',
                            'getAssetsCardsDetails',
                            'getRetiredAssets',
                            'getRetiredAssetsCardsDetails',
                        ],
                        type: 'modal',
                        disable: '',
                        mutationKey: 'RetireAsset',
                        api_type: 'post',
                        modal_details: {
                            title: 'Retire Asset',
                            label: 'Are you sure want to retire this asset? ',
                        },
                        showButton: (mapActionFun) => {
                            if (
                                ['org super admin', 'org admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assettags',
                        showButton: (mapActionFun) => {
                            if (
                                ['org super admin', 'org admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                ],
                customRender: function (row, _, mapActionFun) {
                    return (
                        <>
                            <div
                                className={
                                    row?.original?.agent_status === 'connected'
                                        ? 'assest-active'
                                        : 'assest-inactive'
                                }>
                                {row?.original?.agent_status === 'connected'
                                    ? 'active'
                                    : 'inactive'}
                            </div>

                            <div className="text-nowrap">
                                <Link
                                    to={`/asset-details/${row?.original?.id}`}
                                    style={{
                                        textDecoration: 'none',
                                        fontFamily: 'Plus Jakarta Sans',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        color: '#7A69EE',
                                    }}>
                                    {row?.original?.host_name ? (
                                        <Highlighter
                                            searchVal={mapActionFun['searchVal']}
                                            text={row?.original?.host_name}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </Link>
                                <Dropdown as={ButtonGroup} className="m-l-8">
                                    <Dropdown.Toggle
                                        as="button"
                                        variant="success"
                                        id="dropdown-split-basic"
                                        style={{ background: 'none', border: 'none', padding: 0 }}>
                                        <img
                                            className="dropdown-icon"
                                            src="/images/dropdown_icon.svg"
                                            alt="Dropdown Icon"
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[0]
                                                );
                                            }}>
                                            Report Asset
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            // href="#/action-2"
                                            className={` remove_gap ${checkShowButton(row, this?.actions[1], mapActionFun) ? 'dis-block' : 'dis-none'} `}
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[1]
                                                );
                                            }}>
                                            Retire Asset
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className={` remove_gap ${checkShowButton(row, this?.actions[2], mapActionFun) ? 'dis-block' : 'dis-none'} `}
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[2]
                                                );
                                            }}>
                                            Add Tag{' '}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </>
                    );
                },
            },
            {
                backend_name: 'os',
                label: 'OS ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const value = cell.renderValue()?.toLowerCase();
                    return (
                        <>
                            {row?.original?.os ? (
                                <>
                                    <img
                                        src={`/images/${value}.svg`}
                                        alt={`${value}-image`}
                                        className="os-image"
                                    />
                                </>
                            ) : (
                                '_'
                            )}
                        </>
                    );
                },
            },
            {
                backend_name: 'type',
                label: 'Type',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell) => (
                    <span className="text-capitalize">{cell.getValue()}</span>
                ),
            },
            {
                backend_name: 'ip_address_v4',
                label: 'IPs ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'rti_score',
                label: 'RtI Score ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <div className="Rti">{cell.renderValue ? cell.renderValue() : cell}</div>
                ),
            },
            {
                backend_name: 'last_scanned',
                label: 'Last scanned ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'severity',
                label: 'Severity',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <>
                        <div className={`severity-${cell.renderValue()}`}>
                            <img
                                src={`/images/badges/severity-${cell.renderValue()}.svg`}
                                alt="severity"
                            />
                            {cell.renderValue ? cell.renderValue() : cell}
                        </div>
                    </>
                ),
            },

            {
                backend_name: 'vulnerabilities_count',
                label: 'Vulnerabilities',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const count = cell.renderValue ? cell.renderValue() : 0;
                    const text = count >= 2 ? 'vulnerabilities' : 'vulnerability';

                    return (
                        <div className="  text-center organ_count text-center">
                            {cell.renderValue() === 0 ? (
                                <span className="ms-1 text-muted ">NA</span>
                            ) : (
                                <Link
                                    className="cus-count asset-count text-nowrap"
                                    to={`/vulnerability/${row.original.id}`}>
                                    {count} <span className="ms-1">{text}</span>
                                </Link>
                            )}
                        </div>
                    );
                },
            },
            {
                backend_name: 'tag_value',
                label: 'Tags',
                searchable: false,
                enableSorting: false,
                canModify: true,

                editable: false,
                editDetails: {
                    label: 'AssetTags',
                    client_name: 'assettags',
                    backend_name: 'tag_names',
                    type: 'multi_select_dropdown',
                    placeholder: '',
                    mandatory: true,
                    options: [],
                },

                type: 'modalForm',
                comp: 'FormComp',
                actions: [
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assettags',
                    },
                    {
                        // button: 'add',
                        // api: 'organizations/reinvite-user',
                        // invalidateQuery: ['getAssets'],
                        type: 'modal',
                        modal_details: {
                            title: 'Tags',
                        },
                        customRender: (row) => {
                            return (
                                <div className="tag-modal">
                                    <div className="text-start">
                                        <p className="tag-context">
                                            Displaying tags for asset <span>SQ1 -DT-002</span>
                                        </p>
                                        <div className="m-t-20">
                                            {row?.tag_value?.map((val, index) =>
                                                index % 2 === 0 ? (
                                                    <p
                                                        className="custom-badges tag-container dis-flex-inline m-r-8"
                                                        key={index}>
                                                        {val?.name}
                                                    </p>
                                                ) : (
                                                    <p
                                                        className="custom-badges tag-count dis-flex-inline m-r-8"
                                                        key={index}>
                                                        {val?.name}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        },
                        showModalButtons: false,
                        // comp: 'FormComp',
                        from: 'assettags',
                    },
                ],
                customRender: function (row, cell, mapActionFun) {
                    // Access actions within the object

                    return (
                        <>
                            {cell.renderValue()?.length >= 1 && (
                                <div className="custom-badges tag-container">
                                    {cell
                                        .renderValue()
                                        ?.slice(0, 1)
                                        ?.map((val) => val?.name)}
                                </div>
                            )}

                            <div className="d-flex align-content-end gap-2">
                                {cell.renderValue()?.length >= 2 && (
                                    <div
                                        className="custom-badges tag-count mt-1"
                                        onClick={() => {
                                            mapActionFun['handleActionModal'](row, this.actions[1]);
                                        }}>
                                        {cell.renderValue()?.length > 1 && (
                                            <div>{cell?.renderValue()?.length - 1} More</div>
                                        )}
                                    </div>
                                )}
                                <div className=" tag-action p-0 m-t-5">
                                    {this.actions.slice(0, 1).map((action, index) => {
                                        const value = action.button;
                                        return (
                                            <div
                                                key={`${value}_tag-action${index}`}
                                                className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                                <TooltipComp position="top" content={value}>
                                                    <button
                                                        className="tag-btn "
                                                        disabled={
                                                            'disabled' in action
                                                                ? action.disabled(row)
                                                                : false
                                                        }
                                                        onClick={() =>
                                                            mapActionFun['handleActionModal'](
                                                                row,
                                                                action
                                                            )
                                                        }>
                                                        <img
                                                            src={`/images/${value}.svg`}
                                                            alt={`${value}-image`}
                                                        />
                                                    </button>
                                                </TooltipComp>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    );
                },
            },
        ],
    },
    {
        retiredassets: [
            {
                backend_name: '',
                label: '#',
                headerCustomRender: (table) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: table.getIsAllRowsSelected(),
                                    indeterminate: table.getIsSomeRowsSelected(),
                                    onChange: table.getToggleAllRowsSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: row.getIsSelected(),
                                    onChange: row.getToggleSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
            },
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <>
                        <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                    </>
                ),
            },
            {
                backend_name: 'host_name',
                label: 'Asset ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                editable: false,
                editDetails: {},
                actions: [
                    {
                        button: 'edit',
                        invalidateQuery: ['getRetiredAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assetsreports',
                    },
                    {
                        button: 'delete',
                        api: 'asset-retire',
                        customApi: (mapUrlParams) => {
                            return `assets/revoke/${mapUrlParams['id']}?orgId=${mapUrlParams['orgId']}`;
                        },
                        invalidateQuery: [
                            'getRetiredAssets',
                            'getRetiredAssetsCardsDetails',
                            'getAssets',
                            'getAssetsCardsDetails',
                        ],
                        type: 'modal',
                        disable: '',
                        mutationKey: 'RetireAsset',
                        api_type: 'put',
                        modal_details: {
                            title: 'Revoke Asset',
                            label: 'Are you sure want to revoke this asset? ',
                        },
                        showButton: (mapActionFun) => {
                            if (
                                ['org super admin', 'org admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getRetiredAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'retiredassettags',
                        showButton: (mapActionFun) => {
                            if (
                                ['org super admin', 'org admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                ],
                customRender: function (row, _, mapActionFun) {
                    return (
                        <>
                            <div
                                className={
                                    row?.original?.agent_status === 'connected'
                                        ? 'assest-active'
                                        : 'assest-inactive'
                                }>
                                {row?.original?.agent_status === 'connected'
                                    ? 'active'
                                    : 'inactive'}
                            </div>

                            <div className="text-nowrap">
                                <Link
                                    // to={`/asset-details/${row?.original?.id}`}
                                    // style={{
                                    //     textDecoration: 'none',
                                    //     fontFamily: 'Plus Jakarta Sans',
                                    //     fontWeight: 700,
                                    //     fontSize: '14px',
                                    //     color: '#7A69EE',
                                    // }}
                                    style={{ textDecoration: 'none', color: '#000' }}>
                                    {row?.original?.host_name ? (
                                        <Highlighter
                                            searchVal={mapActionFun['searchVal']}
                                            text={row?.original?.host_name}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </Link>
                                <Dropdown as={ButtonGroup} className="m-l-8">
                                    <Dropdown.Toggle
                                        as="button"
                                        variant="success"
                                        id="dropdown-split-basic"
                                        style={{ background: 'none', border: 'none', padding: 0 }}>
                                        <img
                                            className="dropdown-icon"
                                            src="/images/dropdown_icon.svg"
                                            alt="Dropdown Icon"
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            className={`remove_gap ${checkShowButton(row, this?.actions[0], mapActionFun) ? 'dis-block' : 'dis-none'} `}
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[0]
                                                );
                                            }}>
                                            Report Asset
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className={`remove_gap ${checkShowButton(row, this?.actions[1], mapActionFun) ? 'dis-block' : 'dis-none'} `}
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[1]
                                                );
                                            }}>
                                            Revoke Asset
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className={`remove_gap ${checkShowButton(row, this?.actions[2], mapActionFun) ? 'dis-block' : 'dis-none'} `}
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[2]
                                                );
                                            }}>
                                            Add Tag{' '}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </>
                    );
                },
            },
            {
                backend_name: 'os',
                label: 'OS ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const value = cell.renderValue()?.toLowerCase();
                    return (
                        <>
                            {row?.original?.os ? (
                                <>
                                    <img
                                        src={`/images/${value}.svg`}
                                        alt={`${value}-image`}
                                        className="os-image"
                                    />
                                </>
                            ) : (
                                '_'
                            )}
                        </>
                    );
                },
            },
            {
                backend_name: 'type',
                label: 'Type',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell) => (
                    <span className="text-capitalize">{cell.getValue()}</span>
                ),
            },
            {
                backend_name: 'ip_address_v4',
                label: 'IPs ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'rti_score',
                label: 'RtI Score ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <div className="Rti">{cell.renderValue ? cell.renderValue() : cell}</div>
                ),
            },
            {
                backend_name: 'last_scanned',
                label: 'Last scanned ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'severity',
                label: 'Severity',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <>
                        <div className={`severity-${cell.renderValue()}`}>
                            <img
                                src={`/images/badges/severity-${cell.renderValue()}.svg`}
                                alt="severity"
                            />
                            {cell.renderValue ? cell.renderValue() : cell}
                        </div>
                    </>
                ),
            },

            {
                backend_name: 'vulnerabilities_count',
                label: 'Vulnerabilities',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const count = cell.renderValue ? cell.renderValue() : 0;
                    const text = count >= 2 ? 'vulnerabilities' : 'vulnerability';

                    return (
                        <div className="  text-center organ_count text-center">
                            {cell.renderValue() === 0 ? (
                                <span className="ms-1 text-muted">NA</span>
                            ) : (
                                <Link
                                    className="cus-count asset-count"
                                    to={`/vulnerability/${row.original.id}/retired`}>
                                    {count} <span className="ms-1">{text}</span>
                                </Link>
                            )}
                        </div>
                    );
                },
            },
            {
                backend_name: 'tag_value',
                label: 'Tags',
                searchable: false,
                enableSorting: false,
                canModify: true,

                editable: false,
                editDetails: {
                    label: 'AssetTags',
                    client_name: 'assettags',
                    backend_name: 'tag_names',
                    type: 'multi_select_dropdown',
                    placeholder: '',
                    mandatory: true,
                    options: [],
                },

                type: 'modalForm',
                comp: 'FormComp',
                actions: [
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getRetiredAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'retiredassettags',
                    },
                    {
                        // button: 'add',
                        // api: 'organizations/reinvite-user',
                        // invalidateQuery: ['getAssets'],
                        type: 'modal',
                        modal_details: {
                            title: 'Tags',
                        },
                        customRender: (row) => {
                            return (
                                <>
                                    <div className="tag-modal">
                                        <div className="text-start">
                                            {row?.tag_value?.map((val, index) =>
                                                index % 2 === 0 ? (
                                                    <p
                                                        className="custom-badges tag-container dis-flex-inline m-r-8"
                                                        key={index}>
                                                        {val?.name}
                                                    </p>
                                                ) : (
                                                    <p
                                                        className="custom-badges tag-count dis-flex-inline m-r-8"
                                                        key={index}>
                                                        {val?.name}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </>
                            );
                        },
                        showModalButtons: false,
                        // comp: 'FormComp',
                        from: 'retiredassettags',
                    },
                ],
                customRender: function (row, cell, mapActionFun) {
                    // Access actions within the object

                    return (
                        <>
                            {cell.renderValue()?.length >= 1 && (
                                <div className="custom-badges tag-container">
                                    {cell
                                        .renderValue()
                                        ?.slice(0, 1)
                                        ?.map((val) => val?.name)}
                                </div>
                            )}

                            <div className="d-flex align-content-end gap-2">
                                {cell.renderValue()?.length >= 2 && (
                                    <div
                                        className="custom-badges tag-count mt-1"
                                        onClick={() => {
                                            mapActionFun['handleActionModal'](row, this.actions[1]);
                                        }}>
                                        {cell.renderValue()?.length > 1 && (
                                            <div>{cell?.renderValue()?.length - 1} More</div>
                                        )}
                                    </div>
                                )}
                                <div className=" tag-action p-0 m-t-5">
                                    {this.actions.slice(0, 1).map((action, index) => {
                                        const value = action.button;
                                        return (
                                            <div
                                                key={`${value}_tag-action${index}`}
                                                className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                                <TooltipComp position="top" content={value}>
                                                    <button
                                                        className="tag-btn "
                                                        disabled={
                                                            'disabled' in action
                                                                ? action.disabled(row)
                                                                : false
                                                        }
                                                        onClick={() =>
                                                            mapActionFun['handleActionModal'](
                                                                row,
                                                                action
                                                            )
                                                        }>
                                                        <img
                                                            src={`/images/${value}.svg`}
                                                            alt={`${value}-image`}
                                                        />
                                                    </button>
                                                </TooltipComp>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    );
                },
            },
        ],
    },
    {
        reportassets: [
            {
                backend_name: '',
                label: '#',
                headerCustomRender: (table) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: table.getIsAllRowsSelected(),
                                    indeterminate: table.getIsSomeRowsSelected(),
                                    onChange: table.getToggleAllRowsSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: row.getIsSelected(),
                                    onChange: row.getToggleSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
            },
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <>
                        <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                    </>
                ),
            },
            {
                backend_name: 'host_name',
                label: 'Asset ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                editable: false,
                editDetails: {},
                actions: [
                    {
                        button: 'edit',
                        invalidateQuery: ['getReportAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assetsreports',
                    },
                    {
                        button: 'delete',
                        api: 'asset-retire',
                        customApi: (mapUrlParams) => {
                            return `assets/retire?orgId=${mapUrlParams['orgId']}&id=${mapUrlParams['id']}`;
                        },
                        invalidateQuery: ['getReportAssets', 'getReportAssetsCardsDetails'],
                        type: 'modal',
                        disable: '',
                        mutationKey: 'RetireAsset',
                        api_type: 'post',
                        modal_details: {
                            title: 'Retire Asset',
                            label: 'Are you sure want to retire this asset? ',
                        },
                    },
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getReportAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assettags',
                    },
                ],
                customRender: function (row, _, mapActionFun) {
                    return (
                        <>
                            <div
                                className={
                                    row?.original?.agent_status === 'connected'
                                        ? 'assest-active'
                                        : 'inactive'
                                }>
                                {row?.original?.agent_status === 'connected'
                                    ? 'active'
                                    : 'inactive'}
                            </div>

                            <div className="text-nowrap">
                                <Link
                                    to={`/asset-details/${row?.original?.id}`}
                                    style={{
                                        textDecoration: 'none',
                                        fontFamily: 'Plus Jakarta Sans',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        color: '#7A69EE',
                                    }}>
                                    {row?.original?.host_name ? (
                                        <Highlighter
                                            searchVal={mapActionFun['searchVal']}
                                            text={row?.original?.host_name}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </Link>
                                <Dropdown as={ButtonGroup} className="m-l-8">
                                    <Dropdown.Toggle
                                        as="button"
                                        variant="success"
                                        id="dropdown-split-basic"
                                        style={{ background: 'none', border: 'none', padding: 0 }}>
                                        <img
                                            className="dropdown-icon"
                                            src="/images/dropdown_icon.svg"
                                            alt="Dropdown Icon"
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            // href="#/action-2"
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[1]
                                                );
                                            }}>
                                            Retire Asset
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[2]
                                                );
                                            }}>
                                            Add Tag{' '}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <div>{row?.original?.comment}</div>
                            </div>
                        </>
                    );
                },
            },
            {
                backend_name: 'os',
                label: 'OS ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const value = cell.renderValue()?.toLowerCase();
                    return (
                        <>
                            {row?.original?.os ? (
                                <>
                                    <img
                                        src={`/images/${value}.svg`}
                                        alt={`${value}-image`}
                                        className="os-image"
                                    />
                                </>
                            ) : (
                                '_'
                            )}
                        </>
                    );
                },
            },
            {
                backend_name: 'ip_address_v4',
                label: 'IPs ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'rti_score',
                label: 'RtI Score ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <div className="Rti">{cell.renderValue ? cell.renderValue() : cell}</div>
                ),
            },
            {
                backend_name: 'last_scanned',
                label: 'Last scanned ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'severity',
                label: 'Severity',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <>
                        <div className={`severity-${cell.renderValue()}`}>
                            <img
                                src={`/images/badges/severity-${cell.renderValue()}.svg`}
                                alt="severity"
                            />
                            {cell.renderValue ? cell.renderValue() : cell}
                        </div>
                    </>
                ),
            },

            {
                backend_name: 'vulnerabilities_count',
                label: 'Vulnerabilities',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const count = cell.renderValue ? cell.renderValue() : 0;
                    const text = count >= 2 ? 'vulnerabilities' : 'vulnerability';

                    return (
                        <div className=" text-center organ_count text-center">
                            {cell.renderValue() === 0 ? (
                                <span className="ms-1 text-muted">NA</span>
                            ) : (
                                <Link
                                    className="cus-count asset-count"
                                    to={`/vulnerability/${row.original.id}`}>
                                    {count} <span className="ms-1">{text}</span>
                                </Link>
                            )}
                        </div>
                    );
                },
            },
            {
                backend_name: 'tag_value',
                label: 'Tags',
                searchable: false,
                enableSorting: false,
                canModify: true,

                editable: false,
                editDetails: {
                    label: 'AssetTags',
                    client_name: 'assettags',
                    backend_name: 'tag_names',
                    type: 'multi_select_dropdown',
                    placeholder: '',
                    mandatory: true,
                    options: [],
                },

                type: 'modalForm',
                comp: 'FormComp',
                actions: [
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getReportAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assettags',
                    },
                    {
                        // button: 'add',
                        // api: 'organizations/reinvite-user',
                        // invalidateQuery: ['getAssets'],
                        type: 'modal',
                        customRender: (row) => {
                            return (
                                <>
                                    <div className="text-start">
                                        <h5 className="my-2">Tags</h5>
                                        {row?.tag_value?.map((val, index) =>
                                            index % 2 === 0 ? (
                                                <p
                                                    className="custom-badges tag-container dis-flex-inline m-r-8"
                                                    key={index}>
                                                    {val?.name}
                                                </p>
                                            ) : (
                                                <p
                                                    className="custom-badges tag-count dis-flex-inline m-r-8"
                                                    key={index}>
                                                    {val?.name}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </>
                            );
                        },
                        showModalButtons: false,
                        // comp: 'FormComp',
                        from: 'assettags',
                    },
                ],
                customRender: function (row, cell, mapActionFun) {
                    // Access actions within the object

                    return (
                        <>
                            {cell.renderValue()?.length >= 1 && (
                                <div className="custom-badges tag-container">
                                    {cell
                                        .renderValue()
                                        ?.slice(0, 1)
                                        ?.map((val) => val?.name)}
                                </div>
                            )}

                            <div className="d-flex align-content-end gap-2">
                                {cell.renderValue()?.length >= 2 && (
                                    <div
                                        className="custom-badges tag-count mt-1"
                                        onClick={() => {
                                            mapActionFun['handleActionModal'](row, this.actions[1]);
                                        }}>
                                        {cell.renderValue()?.length > 1 && (
                                            <div>{cell?.renderValue()?.length - 1} More</div>
                                        )}
                                    </div>
                                )}
                                <div className=" tag-action p-0 m-t-5">
                                    {this.actions.slice(0, 1).map((action, index) => {
                                        const value = action.button;
                                        return (
                                            <div
                                                key={`${value}_tag-action${index}`}
                                                className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                                <TooltipComp position="top" content={value}>
                                                    <button
                                                        className="tag-btn "
                                                        disabled={
                                                            'disabled' in action
                                                                ? action.disabled(row)
                                                                : false
                                                        }
                                                        onClick={() =>
                                                            mapActionFun['handleActionModal'](
                                                                row,
                                                                action
                                                            )
                                                        }>
                                                        <img
                                                            src={`/images/${value}.svg`}
                                                            alt={`${value}-image`}
                                                        />
                                                    </button>
                                                </TooltipComp>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    );
                },
            },
        ],
    },
    {
        vulnerabilityassets: [
            {
                backend_name: '',
                label: '#',
                headerCustomRender: (table) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: table.getIsAllRowsSelected(),
                                    indeterminate: table.getIsSomeRowsSelected(),
                                    onChange: table.getToggleAllRowsSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: row.getIsSelected(),
                                    onChange: row.getToggleSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
            },
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <>
                        <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                    </>
                ),
            },
            {
                backend_name: 'host_name',
                label: 'Asset ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                editable: false,
                editDetails: {},
                actions: [
                    {
                        button: 'edit',
                        invalidateQuery: ['getVulnerabilityAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assetsreports',
                    },
                    {
                        button: 'delete',
                        api: 'asset-retire',
                        customApi: (mapUrlParams) => {
                            return `assets/retire?orgId=${mapUrlParams['orgId']}&id=${mapUrlParams['id']}`;
                        },
                        invalidateQuery: ['getVulnerabilityAssets'],
                        type: 'modal',
                        disable: '',
                        mutationKey: 'RetireAsset',
                        api_type: 'post',
                        modal_details: {
                            title: 'Retire Asset',
                            label: 'Are you sure want to retire this asset? ',
                        },
                    },
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getVulnerabilityAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assettags',
                    },
                ],
                customRender: function (row, _, mapActionFun) {
                    return (
                        <>
                            <div
                                className={
                                    row?.original?.agent_status === 'connected'
                                        ? 'assest-active'
                                        : 'inactive'
                                }>
                                {row?.original?.agent_status === 'connected'
                                    ? 'active'
                                    : 'inactive'}
                            </div>

                            <div className="text-nowrap">
                                <Link
                                    to={`/asset-details/${row?.original?.id}`}
                                    style={{ textDecoration: 'none', color: '#000' }}>
                                    {row?.original?.host_name ? row?.original?.host_name : '-'}
                                </Link>
                                <Dropdown as={ButtonGroup} className="m-l-8">
                                    <Dropdown.Toggle
                                        as="button"
                                        variant="success"
                                        id="dropdown-split-basic"
                                        style={{ background: 'none', border: 'none', padding: 0 }}>
                                        <img
                                            className="dropdown-icon"
                                            src="/images/dropdown_icon.svg"
                                            alt="Dropdown Icon"
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[0]
                                                );
                                            }}>
                                            Report Asset
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            // href="#/action-2"
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[1]
                                                );
                                            }}>
                                            Retire Asset
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => {
                                                mapActionFun['handleActionModal'](
                                                    row,
                                                    this?.actions[2]
                                                );
                                            }}>
                                            Add Tag{' '}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </>
                    );
                },
            },
            {
                backend_name: 'os',
                label: 'OS ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const value = cell.renderValue()?.toLowerCase();
                    return (
                        <>
                            {row?.original?.os ? (
                                <>
                                    <img
                                        src={`/images/${value}.svg`}
                                        alt={`${value}-image`}
                                        className="os-image"
                                    />
                                </>
                            ) : (
                                '_'
                            )}
                        </>
                    );
                },
            },
            {
                backend_name: 'ip_address_v4',
                label: 'IPs ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'rti_score',
                label: 'RtI Score ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <div className="Rti">{cell.renderValue ? cell.renderValue() : cell}</div>
                ),
            },
            {
                backend_name: 'last_scanned',
                label: 'Last scanned ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'severity',
                label: 'Severity',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <>
                        <div className={`severity-${cell.renderValue()}`}>
                            <img
                                src={`/images/badges/severity-${cell.renderValue()}.svg`}
                                alt="severity"
                            />
                            {cell.renderValue ? cell.renderValue() : cell}
                        </div>
                    </>
                ),
            },

            {
                backend_name: 'vulnerabilities_count',
                label: 'Vulnerabilities',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => {
                    const count = cell.renderValue ? cell.renderValue() : 0;
                    const text = count >= 2 ? 'vulnerabilities' : 'vulnerability';

                    return (
                        <div className=" text-center organ_count text-center">
                            {cell.renderValue() === 0 ? (
                                <span className="ms-1 text-muted">NA</span>
                            ) : (
                                <Link
                                    className="cus-count asset-count"
                                    to={`/vulnerability/${row.original.id}`}
                                    onClick={() =>
                                        mapActionFun['getSelectedTab']('Vulnerabilities')
                                    }>
                                    {count} <span className="ms-1">{text}</span>
                                </Link>
                            )}
                        </div>
                    );
                },
            },
            {
                backend_name: 'tag_value',
                label: 'Tags',
                searchable: true,
                enableSorting: false,
                canModify: true,

                editable: false,
                editDetails: {
                    label: 'AssetTags',
                    client_name: 'assettags',
                    backend_name: 'tag_names',
                    type: 'multi_select_dropdown',
                    placeholder: '',
                    mandatory: true,
                    options: [],
                },

                type: 'modalForm',
                comp: 'FormComp',
                actions: [
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: ['getVulnerabilityAssets'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'assettags',
                    },
                    {
                        // button: 'add',
                        // api: 'organizations/reinvite-user',
                        // invalidateQuery: ['getAssets'],
                        type: 'modal',
                        customRender: (row) => {
                            return (
                                <>
                                    <div className="text-start">
                                        <h5 className="my-2">Tags</h5>
                                        {row?.tag_value?.map((val, index) =>
                                            index % 2 === 0 ? (
                                                <p
                                                    className="custom-badges tag-container dis-flex-inline m-r-8"
                                                    key={index}>
                                                    {val?.name}
                                                </p>
                                            ) : (
                                                <p
                                                    className="custom-badges tag-count dis-flex-inline m-r-8"
                                                    key={index}>
                                                    {val?.name}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </>
                            );
                        },
                        showModalButtons: false,
                        // comp: 'FormComp',
                        from: 'assettags',
                    },
                ],
                customRender: function (row, cell, mapActionFun) {
                    // Access actions within the object

                    return (
                        <>
                            {cell.renderValue()?.length >= 1 && (
                                <div className="custom-badges tag-container">
                                    {cell
                                        .renderValue()
                                        ?.slice(0, 1)
                                        ?.map((val) => val?.name)}
                                </div>
                            )}

                            <div className="d-flex align-content-end gap-2">
                                {cell.renderValue()?.length >= 2 && (
                                    <div
                                        className="custom-badges tag-count mt-1"
                                        onClick={() => {
                                            mapActionFun['handleActionModal'](row, this.actions[1]);
                                        }}>
                                        {cell.renderValue()?.length > 1 && (
                                            <div>{cell?.renderValue()?.length - 1} More</div>
                                        )}
                                    </div>
                                )}
                                <div className=" tag-action p-0 m-t-5">
                                    {this.actions.slice(0, 1).map((action, index) => {
                                        const value = action.button;
                                        return (
                                            <div
                                                key={`${value}_tag-action${index}`}
                                                className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                                <TooltipComp position="top" content={value}>
                                                    <button
                                                        className="tag-btn "
                                                        disabled={
                                                            'disabled' in action
                                                                ? action.disabled(row)
                                                                : false
                                                        }
                                                        onClick={() =>
                                                            mapActionFun['handleActionModal'](
                                                                row,
                                                                action
                                                            )
                                                        }>
                                                        <img
                                                            src={`/images/${value}.svg`}
                                                            alt={`${value}-image`}
                                                        />
                                                    </button>
                                                </TooltipComp>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    );
                },
            },
        ],
    },
    {
        vulnerability: [
            {
                backend_name: '',
                label: '#',
                headerCustomRender: (table) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: table.getIsAllRowsSelected(),
                                    indeterminate: table.getIsSomeRowsSelected(),
                                    onChange: table.getToggleAllRowsSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...{
                                    checked: row.getIsSelected(),
                                    onChange: row.getToggleSelectedHandler(),
                                }}
                            />
                        </>
                    );
                },
            },
            {
                backend_name: '',
                label: 'S.No',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'vulnerability_id',
                label: 'Vulnerabilities ',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <>
                        <div className="d-flex align-items-center">
                            <Link
                                style={{
                                    textDecoration: 'none',
                                    fontFamily: 'Plus Jakarta Sans',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    color: '#7A69EE',
                                }}
                                to={`/vulnerability-details/${row?.original?.id}`}
                                //   state={{ type: type }}
                            >
                                {row?.original?.vulnerability_id}
                            </Link>{' '}
                        </div>
                        <div className="vulner-desrciption">
                            {/* {row?.original?.description} */}

                            {
                                <Highlighter
                                    searchVal={mapActionFun['searchVal']}
                                    text={row?.original?.description}
                                />
                            }
                        </div>

                        {/* <p className="vulner-risk">90% risk</p> */}
                    </>
                ),
            },
            {
                backend_name: 'first_seen',
                label: 'Released date ',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'exploits_count',
                label: 'Exploits ',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>
                        {cell.renderValue() === 0 ? (
                            <div className="cus-count cus-exploits text-center  organ-count text-center">
                                {/* <Link to={`/exploits/${row.original.id}`}> */}
                                {cell.renderValue ? cell.renderValue() : cell}
                                {/* </Link> */}
                            </div>
                        ) : (
                            <div className="  text-center  organ-count text-center">
                                <Link
                                    to={`/exploits/${row.original.id}`}
                                    className="cus-count cus-exploits">
                                    {cell.renderValue ? cell.renderValue() : cell}
                                </Link>
                            </div>
                        )}
                    </>
                ),
            },
            {
                backend_name: 'social_score',
                label: 'Social score ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => {
                    const getImageSrc = (risk) => {
                        switch (risk) {
                            case 10:
                                return '/vulnerability-scores/100.svg';
                            case 9:
                                return '/vulnerability-scores/90.svg';
                            case 8:
                                return '/vulnerability-scores/80.svg';
                            case 7:
                                return '/vulnerability-scores/70.svg';
                            case 6:
                                return '/vulnerability-scores/60.svg';
                            case 5:
                                return '/vulnerability-scores/50.svg';
                            case 4:
                                return '/vulnerability-scores/40.svg';
                            case 3:
                                return '/vulnerability-scores/30.svg';
                            case 2:
                                return '/vulnerability-scores/20.svg';
                            case 1:
                                return '/vulnerability-scores/10.svg';
                            default:
                                return '/vulnerability-scores/0.svg';
                        }
                    };
                    return (
                        <>
                            <div className="score-graph">
                                <img
                                    src={getImageSrc(row?.original?.social_score)}
                                    alt={`Score: ${row?.original?.social_score}`}
                                />
                                <span
                                    className={getSeverityClass(row?.original?.social_score * 10)}>
                                    {row?.original?.social_score * 10}%
                                </span>
                            </div>
                        </>
                    );
                },
            },
            {
                backend_name: 'severity',
                label: 'Severity',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell, mapActionFun) => (
                    <>
                        <div className={`severity-${cell.renderValue()}`}>
                            <img
                                className="my-1"
                                src={`/images/badges/severity-${cell.renderValue()}.svg`}
                                alt="severity"
                            />
                            {cell.renderValue ? cell.renderValue() : cell}
                        </div>
                        {/* <p className="severity-risk m-t-8 text-nowrap">*Immediate action</p> */}
                    </>
                ),
            },
            {
                backend_name: 'assets_count',
                label: 'Affected IPs',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    return (
                        <div className="text-center">
                            {!!cell.getValue() ? (
                                <div className="cus-count Ips-count   organ_count ">
                                    {cell.getValue()}
                                </div>
                            ) : (
                                '-'
                            )}
                        </div>
                    );
                },
            },
            {
                backend_name: 'tag_value',
                label: 'Tags',
                searchable: false,
                enableSorting: false,
                canModify: true,

                editable: false,
                editDetails: {
                    label: 'vulnerabilityTags',
                    client_name: 'vulnerabilitytags',
                    backend_name: 'tag_names',
                    type: 'multi_select_dropdown',
                    placeholder: '',
                    mandatory: true,
                    options: [],
                },
                type: 'modalForm',
                comp: 'FormComp',
                actions: [
                    {
                        button: 'add',
                        // api: 'organizations/reinvite-user',
                        invalidateQuery: 'getVulnerability',
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'vulnerabilitytags',
                    },
                    {
                        // button: 'add',
                        // api: 'organizations/reinvite-user',
                        // invalidateQuery: ['getAssets'],
                        type: 'modal',
                        modal_details: {
                            title: 'Tags',
                        },
                        customRender: (row) => {
                            return (
                                <div className="tag-modal">
                                    <div className="text-start">
                                        <p className="tag-context">
                                            Displaying tags for asset <span>SQ1 -DT-002</span>
                                        </p>
                                        <div className="m-t-20">
                                            {row?.tag_value?.map((val, index) =>
                                                index % 2 === 0 ? (
                                                    <p
                                                        className="custom-badges tag-container dis-flex-inline m-r-8"
                                                        key={index}>
                                                        {val?.name}
                                                    </p>
                                                ) : (
                                                    <p
                                                        className="custom-badges tag-count dis-flex-inline m-r-8"
                                                        key={index}>
                                                        {val?.name}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        },
                        showModalButtons: false,
                        // comp: 'FormComp',
                        from: 'assettags',
                    },
                ],
                customRender: function (row, cell, mapActionFun) {
                    // Access actions within the object

                    return (
                        <>
                            {cell.renderValue()?.length >= 1 && (
                                <div className="custom-badges tag-container">
                                    {cell
                                        .renderValue()
                                        ?.slice(0, 1)
                                        ?.map((val) => val?.name)}{' '}
                                </div>
                            )}

                            <div className="d-flex align-content-end gap-2">
                                {cell.renderValue()?.length >= 2 && (
                                    <div
                                        className="custom-badges tag-more mt-1"
                                        onClick={() => {
                                            mapActionFun['handleActionModal'](row, this.actions[1]);
                                        }}>
                                        {cell.renderValue()?.length > 1 && (
                                            <div>{cell?.renderValue()?.length - 1} More</div>
                                        )}
                                    </div>
                                )}
                                <div className=" tag-action  m-t-5">
                                    {this.actions.slice(0, 1).map((action, index) => {
                                        const value = action.button;
                                        return (
                                            <div
                                                key={`${value}_tag-action${index}`}
                                                className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                                <TooltipComp position="top" content={value}>
                                                    <button
                                                        className="tag-btn "
                                                        disabled={
                                                            'disabled' in action
                                                                ? action.disabled(row)
                                                                : false
                                                        }
                                                        onClick={() =>
                                                            mapActionFun['handleActionModal'](
                                                                row,
                                                                action
                                                            )
                                                        }>
                                                        <img
                                                            src={`/images/${value}.svg`}
                                                            alt={`${value}-image`}
                                                        />
                                                    </button>
                                                </TooltipComp>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    );
                },
            },
        ],
    },
    {
        reports: [
            {
                backend_name: '',
                label: 'S.No',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },

            {
                backend_name: 'name',
                label: 'Name ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
            },
            {
                backend_name: 'created_at',
                label: 'Generated at ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'creator_name',
                label: 'Generated by',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <div className="text-capitalize">
                        {cell.renderValue ? cell.renderValue() : '-'}
                    </div>
                ),
            },
            {
                backend_name: '',
                label: 'Actions',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [
                    {
                        button: 'delete',
                        api: 'reports/delete',
                        customApi: (mapUrlParams) => {
                            return `reports/delete/${mapUrlParams['orgId']}/${mapUrlParams['id']}`;
                        },
                        invalidateQuery: ['getReports', 'getReportsCardsDetails'],
                        type: 'modal',
                        disable: '',
                        mutationKey: 'deleteReport',
                        api_type: 'delete',
                        modal_details: {
                            title: 'Delete Report',
                            label: 'Are you sure want to delete the report? ',
                        },
                        showButton: (mapActionFun) => {
                            if (
                                ['org super admin', 'org admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                    {
                        button: 'download',
                        api: 'reports/download',
                        invalidateQuery: ['getReports'],
                        type: 'modal',
                        disable: '',
                        mutationKey: 'downloadReport',
                        api_type: 'post',
                        modal_details: {
                            title: 'Download Report',
                            label: 'Are you sure want to download the report? ',
                        },
                        additional_api_params: [
                            {
                                name: 'id',
                                value: 'id',
                                bind: 'row',
                            },
                            {
                                name: 'orgId',
                                bind: 'row',
                                customValue: (mapAdditionalParam) => {
                                    return mapAdditionalParam['orgId'];
                                },
                            },
                        ],
                    },
                ],
                editable: false,
                editDetails: {},
                customRender: function (row, _, mapActionFun) {
                    return (
                        <div className="actions-container">
                            {this.actions.map((action, index) => {
                                const value = action.button;
                                return (
                                    <div
                                        key={`${value}_action_button${index}`}
                                        className={` ${checkShowButton(row, action, mapActionFun) ? 'dis-block d-flex remove_gap' : 'dis-none'} `}>
                                        <TooltipComp position="top" content={value}>
                                            <button
                                                disabled={
                                                    'disabled' in action
                                                        ? action.disabled(row)
                                                        : false
                                                }
                                                onClick={() =>
                                                    mapActionFun['handleActionModal'](row, action)
                                                }>
                                                <img
                                                    src={`/images/${value}.svg`}
                                                    alt={`${value}-image`}
                                                />
                                            </button>
                                        </TooltipComp>
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
        ],
    },
    {
        tags: [
            {
                backend_name: 'sno',
                label: 'S.No',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'name',
                label: 'Tag Name ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: true,
                editDetails: {
                    label: 'Name',
                    client_name: 'name',
                    backend_name: 'name',
                    type: 'text',
                    placeholder: '',
                    mandatory: true,
                    options: [],
                },
            },
            {
                backend_name: 'created_at',
                label: 'Created at ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'updated_at',
                label: 'Modified at',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
            {
                backend_name: 'actions',
                label: '',
                searchable: false,
                enableSorting: false,
                canModify: false,
                editable: false,
                editDetails: {},
                actions: [
                    {
                        button: 'edit',
                        invalidateQuery: ['getTags'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'edittags',
                        showButton: (mapActionFun) => {
                            if (
                                ['org super admin', 'org admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                    {
                        button: 'delete',
                        api: 'tags/delete-tag',
                        customApi: (mapUrlParams) => {
                            return `tags/${mapUrlParams['orgId']}/${mapUrlParams['id']}`;
                        },
                        invalidateQuery: ['getTags', 'getTagsCardsDetails'],
                        type: 'modal',
                        disable: '',
                        mutationKey: 'deleteTag',
                        api_type: 'delete',
                        modal_details: {
                            title: 'Delete Tag',
                            label: 'Are you sure want to delete the Tag? ',
                        },
                        showButton: (mapActionFun) => {
                            if (
                                ['org super admin', 'org admin'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                ],

                customRender: function (row, _, mapActionFun) {
                    return (
                        <div className="actions-container">
                            {this.actions.map((action, index) => {
                                const value = action.button;
                                return (
                                    <div
                                        key={`${value}_action_button${index}`}
                                        className={` ${checkShowButton(row, action, mapActionFun) ? 'dis-block d-flex remove_gap' : 'dis-none'} `}>
                                        <TooltipComp position="top" content={value}>
                                            <button
                                                disabled={
                                                    'disabled' in action
                                                        ? action.disabled(row)
                                                        : false
                                                }
                                                onClick={() =>
                                                    mapActionFun['handleActionModal'](row, action)
                                                }>
                                                <img
                                                    src={`/images/${value}.svg`}
                                                    alt={`${value}-image`}
                                                />
                                            </button>
                                        </TooltipComp>
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
        ],
    },
    {
        exploits: [
            {
                backend_name: 'sno',
                label: 'S.No',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'name',
                label: ' Name ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: true,
                editDetails: {
                    label: 'Name',
                    client_name: 'name',
                    backend_name: 'name',
                    type: 'text',
                    placeholder: '',
                    mandatory: true,
                    options: [],
                },
            },
            {
                backend_name: 'description',
                label: 'Description',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'complexity',
                label: 'Complexity',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell) => (
                    <>
                        <button className={`exploitability-complex severity-${cell?.getValue()}`}>
                            {cell?.getValue()}
                        </button>
                    </>
                ),
            },
            {
                backend_name: 'dependency',
                label: 'Dependency',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell) => (
                    <>
                        <p>
                            {cell?.getValue() === 'yes'
                                ? 'Dependent on other exploits'
                                : 'Self exploitable'}
                        </p>
                    </>
                ),
            },
            {
                backend_name: 'created_at',
                label: 'Created at',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
        ],
    },
    {
        usersOrg: [
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'name',
                label: 'Organization Name ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        {cell.getValue() ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={ucFirst(cell.getValue())}
                            />
                        ) : (
                            '-'
                        )}
                    </>
                ),
            },
            {
                backend_name: 'role',
                label: 'Role',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell) => <div className="text-capitalize">{cell.getValue()}</div>,
            },
            {
                backend_name: '',
                label: 'Actions',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [
                    {
                        button: 'edit',
                        invalidateQuery: ['getUsersOrg'],
                        type: 'modalForm',
                        comp: 'FormComp',
                        from: 'editUsersOrg',
                        showButton: (mapActionFun) => {
                            if (!['sq1 user'].includes(mapActionFun['decrypytActiveRole'])) {
                                return true;
                            }
                            return false;
                        },
                        disabled: (_, mapActionFun) => {
                            if (
                                mapActionFun['routeParam']?.['id'] ===
                                mapActionFun['decrypytUserData']?.userid
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                    {
                        button: 'delete',
                        customApi: (mapUrlParams) => {
                            return `users/user-organization/${mapUrlParams['id']}/${mapUrlParams['routeParam']?.['id']}`;
                        },
                        invalidateQuery: ['getUsersOrg', 'getUsersOrgCardsDetails'],
                        type: 'modal',
                        showButton: (mapActionFun) => {
                            if (!['sq1 user'].includes(mapActionFun['decrypytActiveRole'])) {
                                return true;
                            }
                            return false;
                        },
                        disabled: (_, mapActionFun) => {
                            if (
                                mapActionFun['routeParam']?.['id'] ===
                                mapActionFun['decrypytUserData']?.userid
                            ) {
                                return true;
                            }
                            return false;
                        },
                        mutationKey: 'deleteOrgByUser',
                        api_type: 'delete',
                        modal_details: {
                            title: 'Remove User from Assigned Organization',
                        },
                        customRender: function (row) {
                            return (
                                <>
                                    <div className="px-5">
                                        {`Are you sure want to Unassign  the user from this ${row?.name}?`}
                                    </div>
                                </>
                            );
                        },
                    },
                ],
                editable: false,
                editDetails: {},
                customRender: function (row, _, mapActionFun) {
                    return (
                        <div className="actions-container">
                            {this.actions.map((action, index) => {
                                const value = action.button;
                                return (
                                    <div
                                        key={`${value}_action_button${index}`}
                                        className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                        <TooltipComp position="top" content={value}>
                                            <button
                                                disabled={
                                                    'disabled' in action
                                                        ? action.disabled(row, mapActionFun)
                                                        : false
                                                }
                                                onClick={() =>
                                                    mapActionFun['handleActionModal'](row, action)
                                                }>
                                                {value === 'unlock' ? (
                                                    <MdLockOpen style={{ fontSize: '18px' }} />
                                                ) : (
                                                    <img
                                                        src={`/images/${value}.svg`}
                                                        alt={`${value}-image`}
                                                    />
                                                )}
                                            </button>
                                        </TooltipComp>
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
        ],
    },
    {
        orgUsers: [
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'name',
                label: 'Name ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        {cell.getValue() ? (
                            <Highlighter
                                searchVal={mapActionFun['searchVal']}
                                text={ucFirst(cell.getValue())}
                            />
                        ) : (
                            '-'
                        )}
                    </>
                ),
            },
            {
                backend_name: 'email',
                label: 'Email ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'role_name',
                label: 'Role',
                searchable: false,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell) => <div className="text-capitalize">{cell.getValue()}</div>,
            },
            {
                backend_name: 'status',
                label: 'Status',
                searchable: true,
                enableSorting: false,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: function (_, cell, mapActionFun) {
                    const value = cell.renderValue();

                    return (
                        <div className="cus-badges">
                            <div className={value}>
                                <span>
                                    <img
                                        src={`/images/badges/${value}.svg`}
                                        alt={`${value}-image`}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </span>
                                <span>
                                    <Highlighter
                                        searchVal={mapActionFun['searchVal']}
                                        text={value}
                                    />
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                backend_name: '',
                label: 'Actions',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [
                    {
                        button: 'resend',
                        api: 'organizations/reinvite',
                        invalidateQuery: ['getOrgUsers', 'getOrgUsersCardsDetails'],
                        type: 'modal',
                        mutationKey: 'ResendByOrgUsers',
                        api_type: 'post',
                        disabled: (row) => {
                            const { status } = row?.original;
                            return status.toLowerCase() === 'verified'; // Ensures a boolean return
                        },
                        modal_details: {
                            title: 'Resend invite',
                            label: 'Are you sure want to invite the user? ',
                        },
                        additional_api_params: [
                            {
                                name: 'route',
                                value: `${window?.location?.origin}/register`,
                                bind: false,
                            },
                            {
                                name: 'email',
                                value: 'email',
                                bind: 'row',
                            },
                            {
                                name: 'orgId',
                                bind: 'row',
                                customValue: (val) => {
                                    return val['routeParam']?.['id'];
                                },
                            },
                        ],
                    },
                    {
                        button: 'regenerate',
                        api: '/mfa/regenerate/totp',
                        invalidateQuery: ['getOrgUsers'],
                        type: 'modal',
                        // showButton: (mapActionFun) => {
                        //     if (
                        //         ['sq1 super admin', 'sq1 admin'].includes(
                        //             mapActionFun['decrypytActiveRole']
                        //         )
                        //     ) {
                        //         return true;
                        //     }
                        //     return false;
                        // },
                        disabled: (row) => {
                            const { status, regenerate_reason } = row?.original;
                            return (
                                !regenerate_reason ||
                                ['verified', 'expired'].includes(status?.toLowerCase())
                            ); // Ensures a boolean return
                        },
                        customRender: (row) => {
                            return (
                                <>
                                    <div className="alert alert-warning m-b-10" role="alert">
                                        <span className="fw-bold">Reason : </span>
                                        {row?.regenerate_reason}
                                    </div>
                                </>
                            );
                        },
                        api_type: 'post',
                        mutationKey: 'RegenerateByOrgUser',
                        modal_details: {
                            title: 'Regenerate TOTP',
                            label: 'Are you sure want to regenerate the TOTP? ',
                        },
                        additional_api_params: [
                            {
                                name: 'route',
                                value: `${window?.location?.origin}/login`,
                                bind: false,
                            },
                            {
                                name: 'email',
                                value: 'email',
                                bind: 'row',
                            },
                        ],
                    },
                    {
                        button: 'unlock',
                        api: 'users/unlock',
                        invalidateQuery: ['getOrgUsers'],
                        type: 'modal',
                        mutationKey: 'UnlockByOrgUser',
                        api_type: 'post',
                        disabled: (row) => {
                            return !row?.original?.is_locked;
                        },
                        modal_details: {
                            title: 'Account Unlock',
                            label: 'Are you sure want to unlock the account? ',
                        },
                        additional_api_params: [
                            {
                                name: 'user_id',
                                value: 'id',
                                bind: 'row',
                            },
                        ],
                    },
                    {
                        button: 'delete',
                        customApi: (mapUrlParams) => {
                            return `users/organizations-user/${mapUrlParams['routeParam']?.['id']}/${mapUrlParams['id']}`;
                        },
                        disabled: (row, mapActionFun) => {
                            const { id } = row.original;
                            if (
                                id === mapActionFun['decrypytUserData']?.userid ||
                                ['org user', 'sq1 user'].includes(
                                    mapActionFun['decrypytActiveRole']
                                )
                            ) {
                                return true;
                            }
                            return false;
                        },
                        invalidateQuery: ['getOrgUsers', 'getOrgUsersCardsDetails'],
                        type: 'modal',
                        mutationKey: 'deleteUser',
                        api_type: 'delete',
                        modal_details: {
                            title: 'Delete User',
                            label: 'Are you sure want to delete this? ',
                        },
                    },
                ],
                editable: false,
                editDetails: {},
                customRender: function (row, _, mapActionFun) {
                    // if (
                    //     ['sq1 super admin', 'sq1 admin'].includes(
                    //         mapActionFun['decrypytActiveRole']
                    //     )
                    // ) {
                    return (
                        <div className="actions-container">
                            {this.actions.map((action, index) => {
                                const value = action.button;
                                return (
                                    <div
                                        key={`${value}_action_button${index}`}
                                        className={`d-flex remove_gap ${checkShowButton(row, action, mapActionFun) ? 'dis-block' : 'dis-none'} `}>
                                        <TooltipComp position="top" content={value}>
                                            <button
                                                disabled={
                                                    'disabled' in action
                                                        ? action.disabled(row, mapActionFun)
                                                        : false
                                                }
                                                onClick={() =>
                                                    mapActionFun['handleActionModal'](row, action)
                                                }>
                                                {value === 'unlock' ? (
                                                    <MdLockOpen style={{ fontSize: '18px' }} />
                                                ) : (
                                                    <img
                                                        src={`/images/${value}.svg`}
                                                        alt={`${value}-image`}
                                                    />
                                                )}
                                            </button>
                                        </TooltipComp>
                                    </div>
                                );
                            })}
                        </div>
                    );
                    // } else {
                    //     return <>-</>;
                    // }
                },
            },
        ],
    },
    {
        vulpatches: [
            {
                backend_name: '',
                label: '#',
                searchable: false,
                enableSorting: false,
                canModify: false,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, _, mapActionFun) => (
                    <span>{mapActionFun['data']?.data?.meta?.from + row.index || 0}</span>
                ),
            },
            {
                backend_name: 'description',
                label: ' Vulnerability Description',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => <>{cell.getValue()}</>,
            },
            {
                backend_name: 'os',
                label: 'Affected OS ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => {
                    const value = cell.renderValue()?.toLowerCase();
                    return (
                        <>
                            {row?.original?.os ? (
                                <>
                                    <img
                                        src={`/images/${value}.svg`}
                                        alt={`${value}-image`}
                                        className="os-image"
                                    />
                                </>
                            ) : (
                                '_'
                            )}
                        </>
                    );
                },
            },

            {
                backend_name: 'complexity',
                label: '  Complexity ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        <button className={`patches-complex severity-${cell.getValue()}`}>
                            {cell.getValue()}
                        </button>
                    </>
                ),
            },
            {
                backend_name: 'type',
                label: ' Type',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: '',
                label: 'Action ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        <button className="action-btn text-center ">patch</button>
                    </>
                ),
            },
        ],
    },
    {
        vulexploits: [
            {
                backend_name: 'name',
                label: '  Name ',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
            },
            {
                backend_name: 'description',
                label: ' Description',
                searchable: false,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => <>{cell.getValue()}</>,
            },

            {
                backend_name: 'complexity',
                label: '  Complexity ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        <button className={`patches-complex severity-${cell.getValue()}`}>
                            {cell.getValue()}
                        </button>
                    </>
                ),
            },
            {
                backend_name: 'dependency',
                label: ' Dependency',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (_, cell, mapActionFun) => (
                    <>
                        {cell.getValue() === 'yes'
                            ? 'Dependent on other exploits'
                            : 'Self exploitable'}
                    </>
                ),
            },
            {
                backend_name: 'created_at',
                label: 'Created at ',
                searchable: true,
                enableSorting: true,
                canModify: true,
                actions: [],
                editable: false,
                editDetails: {},
                customRender: (row, cell) => (
                    <>{cell.renderValue ? FormatDate(cell.renderValue()) : cell}</>
                ),
            },
        ],
    },
];

export const filterFields = [
    {
        users: [
            {
                title: 'Status',
                key: 'user_status',
                list: [
                    { name: 'Verified', value: 'verified' },
                    { name: 'Expired', value: 'expired' },
                    { name: 'Invited', value: 'invited' },
                ],
            },
            {
                title: 'Role',
                key: 'role',
                list_from_backend: true,
                apiDetails: {
                    customApi: () => {
                        return `organizations/filter-roles`;
                    },
                    query_name: 'usersFilter',
                    params: (decrypytActiveRole) => {
                        return {
                            type: ['sq1 super admin', 'sq1 admin', 'sq1 user'].includes(
                                decrypytActiveRole
                            )
                                ? 'admin'
                                : 'org',
                        };
                    },
                },
                list: [],
            },
        ],
    },
    {
        organizations: [
            {
                title: 'Status',
                key: 'status',
                list: [
                    { name: 'Active', value: 'active' },
                    { name: 'InActive', value: 'inactive' },
                ],
            },
        ],
    },
    {
        activitylog: [
            {
                title: 'Action',
                key: 'action',
                list: [],
                list_from_backend: true,
            },
            {
                title: 'Module',
                key: 'module',
                list: [
                    { name: 'Asset', value: 'asset' },
                    { name: 'Authentication', value: 'authentication' },
                    { name: 'Organization', value: 'organization' },
                    { name: 'Organization User', value: 'organization_user' },
                    { name: 'SQ1 User', value: 'sq1_user' },
                    { name: 'User', value: 'user' },
                    { name: 'Report', value: 'report' },
                    { name: 'Tag', value: 'tag' },
                ],
            },
        ],
    },
    {
        assets: [
            {
                title: 'Severity',
                key: 'Severity',
                list: [
                    { name: 'Low', value: 'low' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'High', value: 'high' },
                    { name: 'Critical', value: 'critical' },
                ],
            },
            {
                title: 'OS',
                key: 'os',
                list: [
                    { name: 'Windows', value: 'windows' },
                    { name: 'Linux', value: 'linux' },
                    { name: 'Mac', value: 'mac' },
                ],
            },
            {
                title: 'Type',
                key: 'type',
                list: [
                    { name: 'Workstation', value: 'workstation' },
                    { name: 'Server', value: 'server' },
                ],
            },
        ],
    },
    {
        retiredassets: [
            {
                title: 'Severity',
                key: 'Severity',
                list: [
                    { name: 'Low', value: 'low' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'High', value: 'high' },
                    { name: 'Critical', value: 'critical' },
                ],
            },
            {
                title: 'OS',
                key: 'os',
                list: [
                    { name: 'Windows', value: 'windows' },
                    { name: 'Linux', value: 'linux' },
                    { name: 'Mac', value: 'mac' },
                ],
            },
            {
                title: 'Type',
                key: 'type',
                list: [
                    { name: 'Workstation', value: 'workstation' },
                    { name: 'Server', value: 'server' },
                ],
            },
        ],
    },
    {
        reportassets: [
            {
                title: 'Severity',
                key: 'Severity',
                list: [
                    { name: 'Low', value: 'low' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'High', value: 'high' },
                    { name: 'Critical', value: 'critical' },
                ],
            },
            {
                title: 'OS',
                key: 'os',
                list: [
                    { name: 'Windows', value: 'windows' },
                    { name: 'Linux', value: 'linux' },
                    { name: 'Mac', value: 'mac' },
                ],
            },
        ],
    },
    {
        vulnerabilityassets: [
            {
                title: 'Severity',
                key: 'Severity',
                list: [
                    { name: 'Low', value: 'low' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'High', value: 'high' },
                    { name: 'Critical', value: 'critical' },
                ],
            },
            {
                title: 'OS',
                key: 'os',
                list: [
                    { name: 'Windows', value: 'windows' },
                    { name: 'Linux', value: 'linux' },
                    { name: 'Mac', value: 'mac' },
                ],
            },
        ],
    },
    {
        vulnerability: [
            {
                title: 'Severity',
                key: 'Severity',
                list: [
                    { name: 'Low', value: 'low' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'High', value: 'high' },
                    { name: 'Critical', value: 'critical' },
                ],
            },
        ],
    },
    {
        orgUsers: [
            {
                title: 'Status',
                key: 'user_status',

                list: [
                    { name: 'Verified', value: 'verified' },
                    { name: 'Expired', value: 'expired' },
                    { name: 'Invited', value: 'invited' },
                ],
            },
            {
                title: 'Role',
                key: 'role',
                list_from_backend: true,
                apiDetails: {
                    customApi: () => {
                        return `organizations/filter-roles`;
                    },
                    query_name: 'orgUsersFilter',
                    params: () => {
                        return {
                            type: 'org',
                        };
                    },
                },
                list: [],
            },
        ],
    },
];

export const cardDetails = [
    {
        users: {
            apiDetails: {
                url: 'users/count',
                query_name: 'getUsersCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'users',
                    backend_param: 'total',
                },
            ],
        },
    },
    {
        organizations: {
            apiDetails: {
                url: 'organizations/count',
                query_name: 'getOrganizationCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'organization',
                    backend_param: 'total',
                },
                {
                    label: 'Active',
                    img: 'success',
                    backend_param: 'active',
                },
                {
                    label: 'Inactive ',
                    img: 'critical',
                    backend_param: 'inactive',
                },
            ],
        },
    },
    {
        activitylog: {
            apiDetails: {
                url: 'logs/count',
                query_name: 'getLogsCardsDetails',
            },
            is_list_from_backend: true,
            details: [
                {
                    label: 'Activity log',
                    img: 'Activity',
                    backend_param: 'invited',
                },
            ],
        },
    },
    {
        assets: {
            apiDetails: {
                url: 'assets/count',
                query_name: 'getAssetsCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'Assets',
                    backend_param: 'total',
                },
                {
                    label: 'critical',
                    img: 'critical',
                    backend_param: 'critical',
                },
                {
                    label: 'High',
                    img: 'high',
                    backend_param: 'high',
                },
                {
                    label: 'Medium',
                    img: 'medium',
                    backend_param: 'medium',
                },
                {
                    label: 'Low',
                    img: 'low',
                    backend_param: 'low',
                },
            ],
        },
    },
    {
        retiredassets: {
            apiDetails: {
                url: 'assets/count?is_retired=true',
                query_name: 'getRetiredAssetsCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'Assets',
                    backend_param: 'total',
                },
                {
                    label: 'critical',
                    img: 'critical',
                    backend_param: 'critical',
                },
                {
                    label: 'High',
                    img: 'high',
                    backend_param: 'high',
                },
                {
                    label: 'Medium',
                    img: 'medium',
                    backend_param: 'medium',
                },
                {
                    label: 'Low',
                    img: 'low',
                    backend_param: 'low',
                },
            ],
        },
    },
    {
        reportassets: {
            apiDetails: {
                url: 'assets/count?is_reported=true',
                query_name: 'getReportAssetsCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'Assets',
                    backend_param: 'total',
                },
                {
                    label: 'critical',
                    img: 'critical',
                    backend_param: 'critical',
                },
                {
                    label: 'High',
                    img: 'high',
                    backend_param: 'high',
                },
                {
                    label: 'Medium',
                    img: 'medium',
                    backend_param: 'medium',
                },
                {
                    label: 'Low',
                    img: 'low',
                    backend_param: 'low',
                },
            ],
        },
    },
    {
        vulnerabilityassets: {
            apiDetails: {
                url: 'assets/count?vulnerability_assets=true',
                query_name: 'getVulnerabilityAssetsCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'Assets',
                    backend_param: 'total',
                },
                {
                    label: 'critical',
                    img: 'critical',
                    backend_param: 'critical',
                },
                {
                    label: 'High',
                    img: 'high',
                    backend_param: 'high',
                },
                {
                    label: 'Medium',
                    img: 'medium',
                    backend_param: 'medium',
                },
                {
                    label: 'Low',
                    img: 'low',
                    backend_param: 'low',
                },
            ],
        },
    },
    {
        vulnerability: {
            apiDetails: {
                customApi: (mapAPIParam) => {
                    if (!!mapAPIParam['routeParam']?.['id']) {
                        return `vulnerabilities/count/asset-vulnerabilities/${mapAPIParam['routeParam']?.['id']}`;
                    }
                    return `vulnerabilities/count`;
                },
                query_name: 'getVulnerabilityCardsDetails',
                params: (mapAPIParam) => {
                    return {
                        asset_id: mapAPIParam['routeParam']?.['id'],
                        type: mapAPIParam['routeParam']?.['type'],
                    };
                },
            },
            details: [
                {
                    label: 'Total',
                    img: 'vulnerability',
                    backend_param: 'total',
                },
                {
                    label: 'critical',
                    img: 'critical',
                    backend_param: 'critical',
                },
                {
                    label: 'High',
                    img: 'high',
                    backend_param: 'high',
                },
                {
                    label: 'Medium',
                    img: 'medium',
                    backend_param: 'medium',
                },
                {
                    label: 'Low',
                    img: 'low',
                    backend_param: 'low',
                },
            ],
        },
    },
    {
        reports: {
            apiDetails: {
                url: 'reports/count',
                query_name: 'getReportsCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'Reports',
                    backend_param: 'total',
                },
            ],
        },
    },
    {
        tags: {
            apiDetails: {
                url: 'tags/count',
                query_name: 'getTagsCardsDetails',
            },
            details: [
                {
                    label: 'Total',
                    img: 'Tag',
                    backend_param: 'total',
                    value: 0,
                },
            ],
        },
    },
    {
        vulpatches: {
            apiDetails: {
                customApi: (mapAPIParam) => {
                    if (!!mapAPIParam['routeParam']?.['id']) {
                        return `vulnerabilities/count/patch/${mapAPIParam['routeParam']?.['id']}`;
                    }
                    return `vulnerabilities/count/patch`;
                },
                // url: 'vulnerabilities/count/total-exploits',
                query_name: 'getVulPatchCardsDetails',
                params: (mapAPIParam) => {
                    if (!!mapAPIParam['routeParam']?.['id']) {
                        return {
                            vul_id: mapAPIParam['routeParam']?.['id'],
                        };
                    }
                },
            },
            details: [
                {
                    label: 'Total',
                    img: 'Tag',
                    backend_param: 'total',
                    value: 0,
                },
            ],
        },
    },
    {
        exploits: {
            apiDetails: {
                customApi: (mapAPIParam) => {
                    if (!!mapAPIParam['routeParam']?.['id']) {
                        return `vulnerabilities/count/total-exploits/${mapAPIParam['routeParam']?.['id']}`;
                    }
                    return `vulnerabilities/count/total-exploits`;
                },
                // url: 'vulnerabilities/count/total-exploits',
                query_name: 'getExploitsCardsDetails',
                params: (mapAPIParam) => {
                    if (!!mapAPIParam['routeParam']?.['id']) {
                        return {
                            vul_id: mapAPIParam['routeParam']?.['id'],
                        };
                    }
                },
            },
            details: [
                {
                    label: 'Total',
                    img: 'Tag',
                    backend_param: 'total',
                    value: 0,
                },
            ],
        },
    },
    {
        orgUsers: {
            apiDetails: {
                url: 'users/count/organization-users',
                query_name: 'getOrgUsersCardsDetails',
                params: (mapAPIParam) => {
                    return {
                        orgId: mapAPIParam['routeParam']?.['id'],
                    };
                },
            },
            details: [
                {
                    label: 'Total',
                    img: 'users',
                    backend_param: 'total',
                },
            ],
        },
    },
    {
        usersOrg: {
            apiDetails: {
                url: 'organizations/count/user-organizations',
                query_name: 'getUsersOrgCardsDetails',
                params: (mapAPIParam) => {
                    return {
                        userId: mapAPIParam['routeParam']?.['id'],
                    };
                },
            },
            details: [
                {
                    label: 'Total',
                    img: 'organization',
                    backend_param: 'total',
                },
                {
                    label: 'Active',
                    img: 'success',
                    backend_param: 'active',
                },
                {
                    label: 'Inactive ',
                    img: 'critical',
                    backend_param: 'inactive',
                },
            ],
        },
    },
];

export const dashdoard_details = [
    {
        name: 'sq1 super admin',
        apiDetails: {
            url: 'dashboard/admin',
            query_name: 'SQ1AdminDashboard',
        },
        cards: [
            {
                label: 'All organizations',
                backend_param: 'orgs_count',
                img: 'orgs-count',
                clickable: true,
                navigate: 'organization',
            },
            {
                label: 'All users',
                backend_param: 'users_count',
                img: 'users-count',
                clickable: true,
                navigate: 'users',
            },
            {
                label: 'All assets',
                backend_param: 'assets_count',
                img: 'assets-count',
                clickable: false,
            },
            {
                label: 'Vulnerabilities discovered',
                backend_param: 'discovered_vulnerabilities',
                img: 'discovered-vulnerabilities',
                clickable: false,
                has_dropdown: true,
                options: [
                    {
                        label: '1 Day',
                        value: 1,
                    },
                    {
                        label: '10 Days',
                        value: 10,
                    },
                    {
                        label: '20 Days',
                        value: 20,
                    },
                    {
                        label: '30 Days',
                        value: 30,
                    },
                ],
            },
        ],
        charts: [
            {
                type: 'donut',
                title: 'Organizations',
                label: 'Organizations',
                customDataBind: (val = {}) => {
                    const data = val?.data?.org_chart || {};
                    const chartData =
                        Object.keys(data).length > 0
                            ? {
                                  labels: data.name,
                                  datasets: [
                                      {
                                          label: 'Organization',
                                          data: data.value,
                                          backgroundColor: data.fill,
                                          borderRadius: 10,
                                          spacing: 5,
                                          borderWidth: 1,
                                      },
                                  ],
                              }
                            : {};

                    return chartData;
                },
            },
            {
                type: 'donut',
                title: 'User classifications',
                label: 'Users',
                customDataBind: (val = {}) => {
                    const data = val?.data?.users_chart || {};
                    const chartData =
                        Object.keys(data).length > 0
                            ? {
                                  labels: data.name,
                                  datasets: [
                                      {
                                          label: 'User Classification',
                                          data: data.value,
                                          backgroundColor: data.fill,
                                          borderRadius: 10,
                                          spacing: 5,
                                          borderWidth: 1,
                                      },
                                  ],
                              }
                            : {};

                    return chartData;
                },
            },
            {
                type: 'donut',
                title: 'User status',
                label: 'Status',
                customDataBind: (val = {}) => {
                    const data = val?.data?.user_status_chart || {};
                    const chartData =
                        Object.keys(data).length > 0
                            ? {
                                  labels: data.name,
                                  datasets: [
                                      {
                                          label: 'User Status',
                                          data: data.value,
                                          backgroundColor: data.fill,
                                          borderRadius: 10,
                                          spacing: 5,
                                          borderWidth: 1,
                                      },
                                  ],
                              }
                            : {};

                    return chartData;
                },
            },
        ],
    },
];

export const switch_tab_details = [
    {
        name: 'profile-settings',
        list: [
            {
                name: 'Profile Information',
                icon: 'profile',
            },
            {
                name: 'Activity log',
                icon: 'activity_log',
            },
        ],
    },
    {
        name: 'vulnerabilities',
        list: [
            {
                name: 'Vulnerabilities',
            },
            {
                name: 'Assets',
            },
        ],
    },
    {
        name: 'vulnerabilityDetails',
        list: [
            {
                name: 'General Information',
            },
            {
                name: 'Patches',
            },
            {
                name: 'Exploitability',
            },
        ],
    },
    {
        name: 'assets',
        list: [
            {
                name: 'Assets',
            },
            {
                name: 'Retired Assets',
            },
            // {
            //     name: 'Reported Assets',
            // },
        ],
    },
];
