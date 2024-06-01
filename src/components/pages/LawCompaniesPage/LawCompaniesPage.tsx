import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import "./LawCompaniesPage.scss";
import { fetchLawCompanies } from "../../../app/lawCompany/lawCompanySlice";
import PageLoader from "../../layout/PageLoader/PageLoader";

const LawCompaniesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lawCompanies, isLoading, error } = useAppSelector((state: RootState) => state.lawCompanies);

  useEffect(() => {
    dispatch(fetchLawCompanies()).then((res) => {});
  }, [dispatch]);

  return (
    <div className="law-companies-page">
      <h2>Юридические компании</h2>
      {isLoading && <PageLoader />}
      <ul>
        {lawCompanies.map((company, index) => (
          <li key={company.id}>
            <h3>
              {index + 1}. {company.name}
            </h3>
            <p>{company.description}</p>
            <ul>
              <li>
                Адрес:{" "}
                <a href={company.link2gis} target="_blank" rel="noopener noreferrer">
                  {company.address}
                </a>
              </li>
              <li>
                Телефон: <a href={`tel:${company.phoneNumber}`}>{company.phoneNumber}</a>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LawCompaniesPage;
