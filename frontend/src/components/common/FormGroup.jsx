const FormGroup = ({ label, children }) => (
  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8">
    <aside className="w-full md:w-32 pt-2">
      <label className="font-semibold text-gray-900 text-sm block md:text-right">
        {label}
      </label>
    </aside>
    <div className="flex-1 w-full">
      {children}
    </div>
  </div>
);

export default FormGroup;
