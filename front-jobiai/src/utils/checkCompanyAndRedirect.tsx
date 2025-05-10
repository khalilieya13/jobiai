import axios from "axios";

interface CheckCompanyOptions {
    token: string;
    navigate: (path: string) => void;
    onSuccessRedirectPath: string;
    onCreateCompanyRedirectPath: string;
    showPopup: (onConfirm: () => void) => void;
}

export const checkCompanyAndRedirect = async ({
                                                  token,
                                                  navigate,
                                                  onSuccessRedirectPath,
                                                  onCreateCompanyRedirectPath,
                                                  showPopup,
                                              }: CheckCompanyOptions) => {
    try {
        const res = await axios.get("http://localhost:5000/jobiai/api/company", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const hasCompany = res.data && res.data._id;

        if (hasCompany) {
            navigate(onSuccessRedirectPath);
        } else {
            showPopup(() => {
                navigate(onCreateCompanyRedirectPath);
            });
        }
    } catch (error) {
        console.error("Error verifying company:", error);
        // Tu peux ajouter un toast si tu utilises react-toastify
    }
};
