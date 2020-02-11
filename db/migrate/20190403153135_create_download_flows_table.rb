class CreateDownloadFlowsTable < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE TABLE download_flows (
        id INT,
        context_id INT,
        year SMALLINT,
        path INT[],
        jsonb_path JSONB,
        attribute_type TEXT,
        attribute_id INT,
        attribute_name TEXT,
        text_values TEXT,
        sum NUMERIC,
        total TEXT,
        sort TEXT
      ) PARTITION BY LIST (year);
    SQL
  end

  def down
    drop_table :download_flows
  end
end
