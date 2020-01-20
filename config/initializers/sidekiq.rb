Sidekiq.configure_server do |config|
  # this is an error handler for sidekiq; it is used to ensure the job that failed
  # is marked as FAILED in the database_updates tables
  config.error_handlers << Proc.new do |e, ctx_hash|
    return unless ctx_hash[:job] && ctx_hash[:job]['class'] =~ /.+DatabaseUpdateWorker/
    jid = ctx_hash[:job]['jid']
    du = Api::V3::DatabaseUpdate.where(jid: jid).first
    du&.update_attribute(:status, Api::V3::DatabaseUpdate::FAILED)
  end

  config.death_handlers << ->(job, _ex) do
    SidekiqUniqueJobs::Digests.del(digest: job['unique_digest']) if job['unique_digest']
  end

  config.redis = {size: 4}
end

Sidekiq.configure_client do |config|
  config.redis = {size: 2}
end
